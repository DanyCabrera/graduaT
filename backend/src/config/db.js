const { Pool } = require('pg');
const { ObjectId, EJSON } = require('bson');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

let pool;
let schemaReady;
let connectPromise;

function connectionStringForServer(urlString) {
    const url = new URL(urlString);
    url.hostname = url.hostname.replace('-pooler', '');
    url.searchParams.delete('channel_binding');
    url.searchParams.set('sslmode', 'verify-full');
    return url.toString();
}

function assertDatabaseUrl() {
    if (!connectionString) {
        throw new Error('DATABASE_URL no está configurada. Agrega la cadena de conexión de Neon en backend/.env');
    }
}

function createPool() {
    assertDatabaseUrl();
    return new Pool({
        connectionString: connectionStringForServer(connectionString),
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 15000,
    });
}

function getPool() {
    if (!pool) {
        pool = createPool();
    }
    return pool;
}

const textCol = (column, key) =>
    `${column} TEXT GENERATED ALWAYS AS (doc->>'${key}') STORED`;
const boolCol = (column, key) =>
    `${column} BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'${key}') = 'boolean' THEN (doc->>'${key}')::boolean ELSE NULL END) STORED`;
const jsonCol = (column, key) =>
    `${column} JSONB GENERATED ALWAYS AS (doc->'${key}') STORED`;
const numCol = (column, key) =>
    `${column} NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'${key}') = 'number' THEN (doc->>'${key}')::numeric ELSE NULL END) STORED`;
const refCol = (column, key) =>
    `${column} TEXT GENERATED ALWAYS AS (COALESCE(doc->>'${key}', doc #>> '{${key},$oid}')) STORED`;
const dateCol = (column, key) =>
    `${column} TEXT GENERATED ALWAYS AS (COALESCE(doc #>> '{${key},$date}', doc->>'${key}')) STORED`;

const personColumns = [
    textCol('usuario', 'Usuario'),
    textCol('correo', 'Correo'),
    textCol('nombre', 'Nombre'),
    textCol('apellido', 'Apellido'),
    textCol('rol', 'Rol'),
    textCol('telefono', 'Teléfono'),
    boolCol('habilitado', 'habilitado'),
];

const TABLE_COLUMNS = {
    Alumnos: [
        ...personColumns,
        textCol('codigo_curso', 'Código_Curso'),
        textCol('codigo_rol', 'Código_Rol'),
        textCol('codigo_institucion', 'Código_Institución'),
    ],
    Maestros: [
        ...personColumns,
        textCol('codigo_institucion', 'Código_Institución'),
        textCol('codigo_rol', 'Código_Rol'),
        textCol('nombre_institucion', 'Nombre_Institución'),
        jsonCol('curso', 'CURSO'),
    ],
    Directores: [
        ...personColumns,
        textCol('codigo_institucion', 'Código_Institución'),
        textCol('codigo_rol', 'Código_Rol'),
    ],
    Supervisores: [
        ...personColumns,
        textCol('codigo', 'Código'),
        textCol('departamento', 'DEPARTAMENTO'),
        textCol('codigo_institucion', 'Código_Institución'),
        textCol('nombre_institucion', 'Nombre_Institución'),
        boolCol('email_verificado', 'emailVerificado'),
    ],
    Cursos: [
        textCol('codigo', 'Código'),
        textCol('nombre_curso', 'Nombre_Curso'),
    ],
    Resultados: [
        textCol('codigo_alumnos', 'Código_Alumnos'),
        textCol('codigo_colegios', 'Código_Colegios'),
        textCol('codigo_directores', 'Código_Directores'),
        textCol('codigo_maestros', 'Código_Maestros'),
        numCol('punteo', 'Punteo'),
    ],
    Login: [
        ...personColumns,
        textCol('codigo_institucion', 'Código_Institución'),
        textCol('nombre_institucion', 'Nombre_Institución'),
        textCol('codigo_rol', 'Código_Rol'),
        boolCol('email_verificado', 'emailVerificado'),
        textCol('token_verificacion', 'tokenVerificacion'),
    ],
    Colegio: [
        textCol('codigo_institucion', 'Código_Institución'),
        textCol('codigo_alumno', 'Código_Alumno'),
        textCol('codigo_director', 'Código_Director'),
        textCol('codigo_maestro', 'Código_Maestro'),
        textCol('codigo_supervisor', 'Código_Supervisor'),
        textCol('correo', 'Correo'),
        textCol('departamento', 'DEPARTAMENTO'),
        textCol('direccion', 'Dirección'),
        textCol('nombre_completo', 'Nombre_Completo'),
        textCol('telefono', 'Teléfono'),
        textCol('id_colegio', 'ID_Colegio'),
        boolCol('email_verificado', 'emailVerificado'),
        boolCol('habilitado', 'habilitado'),
    ],
    UserAdmin: [
        textCol('usuario', 'Usuario'),
        textCol('correo', 'Correo'),
        textCol('nombre', 'Nombre'),
        textCol('apellido', 'Apellido'),
        textCol('telefono', 'Telefono'),
        boolCol('email_verificado', 'emailVerificado'),
    ],
    codigosAcceso: [
        textCol('codigo', 'codigo'),
        textCol('tipo', 'tipo'),
        boolCol('activo', 'activo'),
        textCol('codigo_institucion', 'codigoInstitucion'),
        textCol('nombre_institucion', 'nombreInstitucion'),
        textCol('descripcion', 'descripcion'),
        textCol('generado_por', 'generadoPor'),
        dateCol('fecha_creacion', 'fechaCreacion'),
    ],
    matematicas: [
        numCol('semana', 'semana'),
        textCol('tema', 'tema'),
        jsonCol('contenido', 'contenido'),
    ],
    comunicacions: [
        numCol('semana', 'semana'),
        textCol('tema', 'tema'),
        jsonCol('contenido', 'contenido'),
    ],
    testmatematicas: [
        numCol('semana', 'semana'),
        textCol('titulo', 'titulo'),
        jsonCol('preguntas', 'preguntas'),
    ],
    testcomunicacions: [
        numCol('semana', 'semana'),
        textCol('titulo', 'titulo'),
        jsonCol('preguntas', 'preguntas'),
    ],
    testAssignments: [
        refCol('test_id', 'testId'),
        textCol('test_type', 'testType'),
        textCol('estado', 'estado'),
        textCol('maestro_id', 'maestroId'),
        textCol('institucion_id', 'institucionId'),
        jsonCol('student_ids', 'studentIds'),
        dateCol('fecha_asignacion', 'fechaAsignacion'),
        dateCol('fecha_vencimiento', 'fechaVencimiento'),
    ],
    testResults: [
        textCol('student_id', 'studentId'),
        refCol('test_id', 'testId'),
        textCol('test_type', 'testType'),
        numCol('score', 'score'),
        numCol('correct_answers', 'correctAnswers'),
        numCol('total_questions', 'totalQuestions'),
        jsonCol('answers', 'answers'),
        dateCol('submitted_at', 'submittedAt'),
    ],
    notifications: [
        textCol('type', 'type'),
        textCol('title', 'title'),
        textCol('student_id', 'studentId'),
        refCol('test_id', 'testId'),
        textCol('test_type', 'testType'),
        numCol('score', 'score'),
        boolCol('read', 'read'),
        textCol('student_institution', 'studentInstitution'),
        dateCol('created_at', 'createdAt'),
    ],
};

function quoteIdent(name) {
    if (!/^[A-Za-z0-9_]+$/.test(name)) {
        throw new Error(`Nombre de colección no válido: ${name}`);
    }
    return `"${name}"`;
}

function createTableSql(name) {
    const columns = TABLE_COLUMNS[name] || [];
    const extras = columns.length ? `,\n    ${columns.join(',\n    ')}` : '';
    return `
        CREATE TABLE IF NOT EXISTS ${quoteIdent(name)} (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL${extras}
        )
    `;
}

async function ensureSchema() {
    if (schemaReady) {
        return schemaReady;
    }

    schemaReady = (async () => {
        const client = getPool();
        await client.query(`
            CREATE TABLE IF NOT EXISTS app_collections (
                name TEXT PRIMARY KEY
            )
        `);

        for (const name of Object.keys(TABLE_COLUMNS)) {
            await client.query(createTableSql(name));
            await client.query(
                'INSERT INTO app_collections (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
                [name]
            );
        }

        const legacy = await client.query(`
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'documents'
        `);
        if (legacy.rowCount > 0) {
            for (const name of Object.keys(TABLE_COLUMNS)) {
                await client.query(
                    `INSERT INTO ${quoteIdent(name)} (doc_id, doc)
                     SELECT doc_id, doc FROM documents WHERE collection_name = $1
                     ON CONFLICT (doc_id) DO UPDATE SET doc = EXCLUDED.doc`,
                    [name]
                );
            }
        }
    })().catch((error) => {
        schemaReady = null;
        throw error;
    });

    return schemaReady;
}

async function ensurePhysicalTable(name) {
    await ensureSchema();
    await getPool().query(createTableSql(name));
    await getPool().query(
        'INSERT INTO app_collections (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [name]
    );
}

function isObjectId(value) {
    return Boolean(value && value._bsontype === 'ObjectId');
}

function idToString(value) {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value.toHexString === 'function') {
        return value.toHexString();
    }
    return String(value);
}

function sameValue(left, right) {
    if (left === right) {
        return true;
    }
    if (left == null || right == null) {
        return left == null && right == null;
    }
    if (isObjectId(left) || isObjectId(right)) {
        return idToString(left) === idToString(right);
    }
    if (left instanceof Date || right instanceof Date) {
        const leftTime = new Date(left).getTime();
        const rightTime = new Date(right).getTime();
        return !Number.isNaN(leftTime) && leftTime === rightTime;
    }
    if (Array.isArray(left) || Array.isArray(right)) {
        if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
            return false;
        }
        return left.every((item, index) => sameValue(item, right[index]));
    }
    if (typeof left === 'object' || typeof right === 'object') {
        if (typeof left !== 'object' || typeof right !== 'object') {
            return false;
        }
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) {
            return false;
        }
        return leftKeys.every((key) => sameValue(left[key], right[key]));
    }
    return false;
}

function isOperatorObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value instanceof Date || isObjectId(value)) {
        return false;
    }
    const keys = Object.keys(value);
    return keys.length > 0 && keys.every((key) => key.startsWith('$'));
}

function matchesField(value, condition) {
    if (!isOperatorObject(condition)) {
        return sameValue(value, condition);
    }

    if (condition.$in) {
        const expected = condition.$in;
        if (Array.isArray(value)) {
            return value.some((item) => expected.some((candidate) => sameValue(item, candidate)));
        }
        return expected.some((candidate) => sameValue(value, candidate));
    }

    if (condition.$nin) {
        const excluded = condition.$nin;
        if (Array.isArray(value)) {
            return value.every((item) => excluded.every((candidate) => !sameValue(item, candidate)));
        }
        return excluded.every((candidate) => !sameValue(value, candidate));
    }

    if (condition.$regex !== undefined) {
        const flags = condition.$options || '';
        const pattern = condition.$regex instanceof RegExp
            ? condition.$regex
            : new RegExp(condition.$regex, flags);
        return pattern.test(value == null ? '' : String(value));
    }

    if (condition.$ne !== undefined && sameValue(value, condition.$ne)) {
        return false;
    }

    if (condition.$exists !== undefined) {
        const exists = value !== undefined;
        if (Boolean(condition.$exists) !== exists) {
            return false;
        }
    }

    if (condition.$gt !== undefined || condition.$gte !== undefined || condition.$lt !== undefined || condition.$lte !== undefined) {
        if (compareValues(value, condition.$gt ?? condition.$gte ?? condition.$lt ?? condition.$lte) === null) {
            return false;
        }
        if (condition.$gt !== undefined && !(compareValues(value, condition.$gt) > 0)) return false;
        if (condition.$gte !== undefined && !(compareValues(value, condition.$gte) >= 0)) return false;
        if (condition.$lt !== undefined && !(compareValues(value, condition.$lt) < 0)) return false;
        if (condition.$lte !== undefined && !(compareValues(value, condition.$lte) <= 0)) return false;
    }

    return true;
}

function matches(doc, filter) {
    if (!filter) {
        return true;
    }

    return Object.entries(filter).every(([key, condition]) => {
        if (key === '$or') {
            return Array.isArray(condition) && condition.some((branch) => matches(doc, branch));
        }
        if (key === '$and') {
            return Array.isArray(condition) && condition.every((branch) => matches(doc, branch));
        }
        return matchesField(doc[key], condition);
    });
}

function compareValues(left, right) {
    if (left == null && right == null) return 0;
    if (left == null) return -1;
    if (right == null) return 1;

    const leftDate = left instanceof Date || (typeof left === 'string' && !Number.isNaN(Date.parse(left)) && /T|:/.test(String(left)));
    const rightDate = right instanceof Date || (typeof right === 'string' && !Number.isNaN(Date.parse(right)) && /T|:/.test(String(right)));
    if ((left instanceof Date || right instanceof Date) && (leftDate || rightDate)) {
        return new Date(left).getTime() - new Date(right).getTime();
    }
    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }
    if (isObjectId(left) || isObjectId(right)) {
        return idToString(left).localeCompare(idToString(right));
    }
    return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

function sortDocs(docs, sortSpec) {
    if (!sortSpec) {
        return docs;
    }
    const entries = Object.entries(sortSpec);
    return [...docs].sort((left, right) => {
        for (const [field, direction] of entries) {
            const compared = compareValues(left[field], right[field]);
            if (compared !== 0) {
                return direction < 0 ? -compared : compared;
            }
        }
        return 0;
    });
}

function toPlain(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null || typeof value !== 'object') {
        return value;
    }
    if (value instanceof Date || isObjectId(value) || value._bsontype) {
        return value;
    }
    if (Array.isArray(value)) {
        return value.filter((item) => item !== undefined).map((item) => toPlain(item));
    }
    const plain = {};
    for (const key of Object.keys(value)) {
        if (value[key] !== undefined) {
            plain[key] = toPlain(value[key]);
        }
    }
    return plain;
}

function serializeDoc(doc) {
    const plain = toPlain(doc);
    if (!plain._id) {
        plain._id = new ObjectId();
    }
    return {
        id: idToString(plain._id),
        stored: EJSON.serialize(plain, { relaxed: false }),
    };
}

function deserializeDoc(stored) {
    return EJSON.deserialize(stored);
}

function applyUpdate(doc, update) {
    const next = deserializeDoc(EJSON.serialize(doc, { relaxed: false }));

    if (update.$set) {
        for (const [key, value] of Object.entries(update.$set)) {
            if (key === '_id' || value === undefined) {
                continue;
            }
            next[key] = value;
        }
    }

    if (update.$pull) {
        for (const [key, value] of Object.entries(update.$pull)) {
            if (Array.isArray(next[key])) {
                next[key] = next[key].filter((item) => !sameValue(item, value));
            }
        }
    }

    if (update.$unset) {
        for (const key of Object.keys(update.$unset)) {
            delete next[key];
        }
    }

    return next;
}

class Cursor {
    constructor(loader) {
        this.loader = loader;
        this.sortSpec = null;
        this.limitCount = null;
    }

    sort(sortSpec) {
        this.sortSpec = sortSpec;
        return this;
    }

    limit(limitCount) {
        this.limitCount = limitCount;
        return this;
    }

    async toArray() {
        let docs = await this.loader();
        docs = sortDocs(docs, this.sortSpec);
        if (Number.isInteger(this.limitCount)) {
            docs = docs.slice(0, this.limitCount);
        }
        return docs;
    }
}

class PgCollection {
    constructor(db, name) {
        this.db = db;
        this.name = name;
    }

    async findMatching(filter) {
        await ensureSchema();
        let result;
        try {
            result = await getPool().query(
                `SELECT doc FROM ${quoteIdent(this.name)} ORDER BY seq ASC`
            );
        } catch (error) {
            if (error.code === '42P01') {
                return [];
            }
            throw error;
        }
        return result.rows
            .map((row) => deserializeDoc(row.doc))
            .filter((doc) => matches(doc, filter || {}));
    }

    find(filter = {}) {
        return new Cursor(() => this.findMatching(filter));
    }

    async findOne(filter = {}, options = {}) {
        const docs = sortDocs(await this.findMatching(filter), options.sort);
        return docs[0] || null;
    }

    async insertOne(doc) {
        const { id, stored } = serializeDoc(doc);
        await ensurePhysicalTable(this.name);
        await getPool().query(
            `INSERT INTO ${quoteIdent(this.name)} (doc_id, doc) VALUES ($1, $2::jsonb)`,
            [id, JSON.stringify(stored)]
        );
        return {
            acknowledged: true,
            insertedId: deserializeDoc(stored)._id,
        };
    }

    async insertMany(docs) {
        if (!docs || docs.length === 0) {
            return { acknowledged: true, insertedCount: 0, insertedIds: {} };
        }

        await ensurePhysicalTable(this.name);
        const client = await getPool().connect();
        const insertedIds = {};
        const table = quoteIdent(this.name);
        try {
            await client.query('BEGIN');
            for (let index = 0; index < docs.length; index += 1) {
                const { id, stored } = serializeDoc(docs[index]);
                await client.query(
                    `INSERT INTO ${table} (doc_id, doc) VALUES ($1, $2::jsonb)`,
                    [id, JSON.stringify(stored)]
                );
                insertedIds[index] = deserializeDoc(stored)._id;
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

        return {
            acknowledged: true,
            insertedCount: docs.length,
            insertedIds,
        };
    }

    async updateOne(filter, update) {
        return this.update(filter, update, true);
    }

    async updateMany(filter, update) {
        return this.update(filter, update, false);
    }

    async update(filter, update, onlyFirst) {
        await ensureSchema();
        const client = await getPool().connect();
        let matchedCount = 0;
        let modifiedCount = 0;
        const table = quoteIdent(this.name);

        try {
            await client.query('BEGIN');
            const result = await client.query(
                `SELECT seq, doc FROM ${table} ORDER BY seq ASC FOR UPDATE`
            );

            for (const row of result.rows) {
                const current = deserializeDoc(row.doc);
                if (!matches(current, filter || {})) {
                    continue;
                }
                matchedCount += 1;
                const next = applyUpdate(current, update || {});
                const before = JSON.stringify(EJSON.serialize(current, { relaxed: false }));
                const after = JSON.stringify(EJSON.serialize(toPlain(next), { relaxed: false }));
                if (before !== after) {
                    const stored = EJSON.serialize(toPlain(next), { relaxed: false });
                    await client.query(
                        `UPDATE ${table} SET doc = $1::jsonb WHERE seq = $2`,
                        [JSON.stringify(stored), row.seq]
                    );
                    modifiedCount += 1;
                }
                if (onlyFirst) {
                    break;
                }
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            if (error.code === '42P01') {
                return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
            }
            throw error;
        } finally {
            client.release();
        }

        return { acknowledged: true, matchedCount, modifiedCount };
    }

    async deleteOne(filter) {
        return this.delete(filter, true);
    }

    async deleteMany(filter = {}) {
        return this.delete(filter, false);
    }

    async delete(filter, onlyFirst) {
        await ensureSchema();
        const client = await getPool().connect();
        let deletedCount = 0;
        const table = quoteIdent(this.name);

        try {
            await client.query('BEGIN');
            const result = await client.query(
                `SELECT seq, doc FROM ${table} ORDER BY seq ASC FOR UPDATE`
            );
            const ids = [];
            for (const row of result.rows) {
                if (!matches(deserializeDoc(row.doc), filter || {})) {
                    continue;
                }
                ids.push(row.seq);
                if (onlyFirst) {
                    break;
                }
            }
            if (ids.length > 0) {
                await client.query(`DELETE FROM ${table} WHERE seq = ANY($1::bigint[])`, [ids]);
                deletedCount = ids.length;
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            if (error.code === '42P01') {
                return { acknowledged: true, deletedCount: 0 };
            }
            throw error;
        } finally {
            client.release();
        }

        return { acknowledged: true, deletedCount };
    }

    async countDocuments(filter = {}) {
        const docs = await this.findMatching(filter);
        return docs.length;
    }

    async distinct(field) {
        const docs = await this.findMatching({});
        const values = [];
        for (const doc of docs) {
            if (doc[field] === undefined) {
                continue;
            }
            if (!values.some((existing) => sameValue(existing, doc[field]))) {
                values.push(doc[field]);
            }
        }
        return values;
    }
}

class PgDatabase {
    collection(name) {
        return new PgCollection(this, name);
    }

    async createCollection(name) {
        await ensurePhysicalTable(name);
        return { ok: 1 };
    }

    listCollections() {
        return {
            toArray: async () => {
                await ensureSchema();
                const result = await getPool().query('SELECT name FROM app_collections ORDER BY name ASC');
                return result.rows.map((row) => ({ name: row.name, type: 'collection' }));
            },
        };
    }
}

const database = new PgDatabase();

async function connectDB() {
    if (!connectPromise) {
        connectPromise = (async () => {
            assertDatabaseUrl();
            let host = 'neon';
            try {
                host = new URL(connectionStringForServer(connectionString)).hostname;
            } catch (error) {
                host = 'neon';
            }

            console.log('🔄 Intentando conectar a PostgreSQL (Neon)...');
            console.log(`🌐 Host: ${host}`);
            await ensureSchema();
            await getPool().query('SELECT 1');
            console.log('✅ Conectado a PostgreSQL (Neon)');
            return database;
        })().catch((error) => {
            connectPromise = null;
            throw error;
        });
    }

    return connectPromise;
}

async function getDB() {
    await connectDB();
    return database;
}

async function closeDB() {
    if (pool) {
        await pool.end();
        pool = null;
        schemaReady = null;
        connectPromise = null;
        console.log('🔌 Conexión a PostgreSQL cerrada');
    }
}

async function createCollections() {
    const names = [
        'Alumnos',
        'Maestros',
        'Directores',
        'Supervisores',
        'Cursos',
        'Resultados',
        'Login',
        'Colegio',
        'UserAdmin',
        'codigosAcceso',
        'matematicas',
        'comunicacions',
        'testmatematicas',
        'testcomunicacions',
        'testAssignments',
        'testResults',
        'notifications',
    ];

    for (const name of names) {
        await database.createCollection(name);
    }
    console.log('✅ Colecciones de PostgreSQL listas');
}

function schemaSql() {
    const header = `
CREATE TABLE IF NOT EXISTS app_collections (
    name TEXT PRIMARY KEY
);
`.trim();
    const tables = Object.keys(TABLE_COLUMNS).map((name) => `${createTableSql(name).trim()};`);
    const registry = Object.keys(TABLE_COLUMNS)
        .map((name) => `    ('${name}')`)
        .join(',\n');
    return `${header}\n\n${tables.join('\n\n')}\n\nINSERT INTO app_collections (name) VALUES\n${registry}\nON CONFLICT (name) DO NOTHING;\n`;
}

module.exports = {
    connectDB,
    getDB,
    closeDB,
    createCollections,
    schemaSql,
};
