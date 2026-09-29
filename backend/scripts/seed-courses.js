require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('bson');
const { getDB, closeDB } = require('../src/config/db');

const docsDir = path.resolve(__dirname, '../../frontend/docs');
const dryRun = process.argv.includes('--dry');

function clean(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function groupLines(items) {
    const lines = [];
    for (const item of items) {
        if (!item.str) {
            continue;
        }
        const y = Math.round(item.transform[5]);
        let line = lines.find((candidate) => Math.abs(candidate.y - y) <= 2);
        if (!line) {
            line = { y, items: [] };
            lines.push(line);
        }
        line.items.push(item);
    }
    for (const line of lines) {
        line.items.sort((a, b) => a.transform[4] - b.transform[4]);
        line.text = clean(line.items.map((item) => item.str).join(''));
    }
    lines.sort((a, b) => b.y - a.y);
    return lines.filter((line) => line.text);
}

async function loadPdf(fileName) {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const file = path.join(docsDir, fileName);
    const data = new Uint8Array(fs.readFileSync(file));
    const doc = await pdfjs.getDocument({ data, disableWorker: true, isEvalSupported: false }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const annotations = await page.getAnnotations();
        pages.push({
            lines: groupLines(textContent.items),
            links: annotations
                .map((annotation) => ({
                    url: annotation.url || annotation.unsafeUrl || '',
                    rect: annotation.rect,
                }))
                .filter((annotation) => annotation.url),
        });
    }
    return pages;
}

function linkForLine(links, y) {
    const match = links.find((link) => y >= link.rect[1] - 4 && y <= link.rect[3] + 4);
    return match ? match.url : '';
}

function parseTopics(pages) {
    const topics = [];
    let subject = 'matematicas';

    for (const page of pages) {
        for (const line of page.lines) {
            const plain = line.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (/^comunicacion y lenguaje$/i.test(plain)) {
                subject = 'comunicacion';
                continue;
            }
            if (/^matematicas$/i.test(plain)) {
                subject = 'matematicas';
                continue;
            }

            const numbered = line.text.match(/^(\d+)\.\s+(.+)$/);
            if (numbered) {
                topics.push({
                    subject,
                    titulo: clean(numbered[2]),
                    url: linkForLine(page.links, line.y),
                });
                continue;
            }

            const last = topics[topics.length - 1];
            const startsAt = line.items[0] ? line.items[0].transform[4] : 0;
            if (last && startsAt > 115 && !/^semana/i.test(line.text)) {
                last.titulo = clean(`${last.titulo} ${line.text}`);
            }
        }
    }

    return topics;
}

function toWeeks(topics, nombre) {
    const weeks = [];
    for (let index = 0; index < topics.length; index += 5) {
        const slice = topics.slice(index, index + 5);
        weeks.push({
            semana: weeks.length + 1,
            nombre,
            temas: slice.map((tema, dia) => ({
                dia: dia + 1,
                titulo: tema.titulo,
                url: tema.url,
            })),
        });
    }
    return weeks;
}

function parseOption(line) {
    const match = line.text.match(/^([A-Da-d])[.)]\s*(.*)$/);
    if (!match) {
        return null;
    }
    const letterItem = line.items.find((item) => /^[A-Da-d][.)]$/.test(item.str.trim()));
    const textItem = [...line.items].reverse().find((item) => {
        const value = item.str.trim();
        return value && !/^[A-Da-d][.)]$/.test(value);
    });
    let marcada = false;
    if (letterItem && textItem) {
        const gap = textItem.transform[4] - (letterItem.transform[4] + (letterItem.width || 0));
        marcada = gap > 12;
    }
    return {
        letra: match[1].toUpperCase(),
        texto: clean(match[2] || (textItem ? textItem.str : '')),
        marcada,
    };
}

function parseTests(pages, markCorrect = false) {
    const tests = [];
    let current = null;
    let question = null;

    function flushQuestion() {
        if (!question || !current) {
            question = null;
            return;
        }
        const stem = clean(question.partes.join(' '));
        const opciones = question.opciones;
        const marcada = markCorrect ? opciones.filter((opcion) => opcion.marcada) : [];
        const nombre = [stem, ...opciones.map((opcion) => `${opcion.letra}. ${opcion.texto}`)]
            .filter(Boolean)
            .join('\n');
        current.preguntas.push({
            nombre,
            url: '',
            respuesta: marcada.length === 1 ? marcada[0].letra : '',
        });
        question = null;
    }

    for (const page of pages) {
        for (const line of page.lines) {
            const semana = line.text.match(/^semana\s*(\d+)\s*:?$/i);
            if (semana) {
                flushQuestion();
                current = { semana: Number(semana[1]), preguntas: [] };
                tests.push(current);
                continue;
            }
            if (/^temas:/i.test(line.text) || /^test:/i.test(line.text)) {
                continue;
            }

            const questionMatch = line.text.match(/^(\d+)\.\s*(.*)$/);
            const x = line.items[0] ? line.items[0].transform[4] : 0;
            if (questionMatch && x < 115 && current) {
                flushQuestion();
                question = { partes: questionMatch[2] ? [questionMatch[2]] : [], opciones: [] };
                continue;
            }

            const option = parseOption(line);
            if (option && question) {
                question.opciones.push(option);
                continue;
            }

            if (!question) {
                continue;
            }
            if (question.opciones.length === 0) {
                question.partes.push(line.text);
            } else {
                const last = question.opciones[question.opciones.length - 1];
                last.texto = clean(`${last.texto} ${line.text}`);
            }
        }
    }
    flushQuestion();
    return tests;
}

const MATH_KEYS = [
    ['A', 'A', '', 'A', 'B'],
    ['', '', '', '', ''],
    ['D', 'D', 'C', 'B', 'B'],
    ['D', 'C', 'D', 'B', 'B'],
    ['C', 'D', 'A', 'A', 'B'],
    ['B', 'A', '', 'C', 'A'],
    ['D', 'C', 'D', '', 'C'],
    ['D', 'A', 'A', 'B', 'B'],
    ['', 'D', 'C', '', 'D'],
    ['B', 'B', '', 'B', 'C'],
    ['', '', 'C', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['C', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['C', 'D', 'C', 'A', 'B'],
    ['A', '', 'A', 'C', 'B'],
    ['A', '', '', 'A', 'B'],
    ['', '', '', '', 'B'],
    ['', 'B', '', '', ''],
    ['', '', '', '', 'B'],
    ['B', 'B', 'C', 'D', 'A'],
    ['D', 'A', '', '', 'C'],
    ['D', '', 'C', 'D', ''],
    ['A', 'D', '', '', ''],
    ['D', 'C', '', 'D', 'B'],
    ['C', 'B', 'B', 'C', 'B'],
    ['A', 'D', 'B', '', 'C'],
    ['A', 'C', '', 'B', 'A'],
    ['B', 'B', 'D', 'C', 'B'],
    ['B', 'B', '', 'A', 'C'],
    ['D', 'B', 'C', 'A', 'A'],
    ['A', 'A', '', 'B', 'B'],
    ['B', 'B', 'A', 'B', 'D'],
    ['', 'B', 'A', 'A', 'C'],
    ['B', 'B', 'A', '', 'A'],
    ['', 'D', 'B', 'B', 'A'],
    ['C', 'A', 'D', '', 'B'],
];

function applyMathKeys(tests) {
    tests.forEach((test) => {
        const key = MATH_KEYS[test.semana - 1] || [];
        test.preguntas.forEach((pregunta, index) => {
            if (!pregunta.respuesta && key[index]) {
                pregunta.respuesta = key[index];
            }
        });
    });
}

function attachTopicLinks(tests, topics) {
    for (const test of tests) {
        test.preguntas.forEach((pregunta, index) => {
            const topic = topics[(test.semana - 1) * 5 + index] || topics[(test.semana - 1) * 5];
            pregunta.url = topic?.url || '';
        });
    }
}

function asTestDocuments(tests, curso, titulo) {
    return tests.map((test) => ({
        semana: test.semana,
        titulo: `${titulo} - Semana ${test.semana}`,
        descripcion: `Evaluación de ${titulo} para la semana ${test.semana}`,
        duracion: 30,
        dificultad: 'media',
        curso,
        preguntas: test.preguntas.map((pregunta) => ({
            _id: new ObjectId(),
            nombre: pregunta.nombre,
            url: pregunta.url,
            respuesta: pregunta.respuesta,
        })),
    }));
}

async function main() {
    const topicPages = await loadPdf('TemasPruebaT.pdf');
    const mathPages = await loadPdf('TEST MATEMATICAS.pdf');
    const commPages = await loadPdf('TEST COMUNICACIÓN Y LENGUAJE.pdf');

    const topics = parseTopics(topicPages);
    const mathTopics = topics.filter((topic) => topic.subject === 'matematicas');
    const commTopics = topics.filter((topic) => topic.subject === 'comunicacion');
    const mathWeeks = toWeeks(mathTopics, 'Matemáticas');
    const commWeeks = toWeeks(commTopics, 'Comunicación y lenguaje');

    const mathTests = parseTests(mathPages, false);
    const commTests = parseTests(commPages, true);
    attachTopicLinks(mathTests, mathTopics);
    attachTopicLinks(commTests, commTopics);
    applyMathKeys(mathTests);
    for (const test of commTests) {
        for (const pregunta of test.preguntas) {
            if (!pregunta.respuesta && /elemento importante que se debe tomar en cuenta al escribir/i.test(pregunta.nombre)) {
                pregunta.respuesta = 'B';
            }
        }
    }

    if (process.argv.includes('--dump')) {
        const lines = [];
        for (const test of mathTests) {
            lines.push(`\n## SEMANA ${test.semana}`);
            test.preguntas.forEach((pregunta, index) => lines.push(`${index + 1}. ${pregunta.nombre.replace(/\n/g, ' | ')}`));
        }
        fs.writeFileSync(path.resolve(__dirname, 'math-questions.txt'), lines.join('\n'));
        console.log('preguntas matematicas', mathTests.reduce((t, test) => t + test.preguntas.length, 0));
        console.log('comunicacion con respuesta', commTests.reduce((t, test) => t + test.preguntas.filter((p) => p.respuesta).length, 0), '/', commTests.reduce((t, test) => t + test.preguntas.length, 0));
        return;
    }

    const mathMissing = mathTests.reduce((total, test) => total + test.preguntas.filter((pregunta) => !pregunta.respuesta).length, 0);
    const commMissing = commTests.reduce((total, test) => total + test.preguntas.filter((pregunta) => !pregunta.respuesta).length, 0);
    commTests.forEach((test) => {
        test.preguntas.forEach((pregunta, index) => {
            if (!pregunta.respuesta) {
                console.log(`Comunicación semana ${test.semana} pregunta ${index + 1} sin respuesta: ${pregunta.nombre}`);
            }
        });
    });

    const summary = {
        temasMatematicas: mathTopics.length,
        temasComunicacion: commTopics.length,
        semanasMatematicas: mathWeeks.length,
        semanasComunicacion: commWeeks.length,
        temasSinLink: topics.filter((topic) => !topic.url).length,
        testsMatematicas: mathTests.length,
        preguntasMatematicas: mathTests.reduce((total, test) => total + test.preguntas.length, 0),
        testsComunicacion: commTests.length,
        preguntasComunicacion: commTests.reduce((total, test) => total + test.preguntas.length, 0),
        respuestasVacias: mathMissing + commMissing,
    };
    console.log(JSON.stringify(summary, null, 2));
    console.log('Ejemplo tema:', JSON.stringify(mathWeeks[0]?.temas[0]));
    console.log('Ejemplo pregunta:', JSON.stringify(commTests[0]?.preguntas[0]));

    if (dryRun) {
        return;
    }

    const db = await getDB();
    await db.collection('matematicas').deleteMany({});
    await db.collection('comunicacions').deleteMany({});
    await db.collection('testmatematicas').deleteMany({});
    await db.collection('testcomunicacions').deleteMany({});

    const mathAgenda = await db.collection('matematicas').insertMany(mathWeeks);
    const commAgenda = await db.collection('comunicacions').insertMany(commWeeks);
    const mathInserted = await db.collection('testmatematicas').insertMany(asTestDocuments(mathTests, 'matematicas', 'Test de Matemáticas'));
    const commInserted = await db.collection('testcomunicacions').insertMany(asTestDocuments(commTests, 'comunicacion', 'Test de Comunicación'));

    console.log(JSON.stringify({
        agendasMatematicas: mathAgenda.insertedCount,
        agendasComunicacion: commAgenda.insertedCount,
        testsMatematicas: mathInserted.insertedCount,
        testsComunicacion: commInserted.insertedCount,
    }));
    await closeDB();
}

main().catch(async (error) => {
    console.error(error);
    try { await closeDB(); } catch (closeError) { /* ignore */ }
    process.exit(1);
});
