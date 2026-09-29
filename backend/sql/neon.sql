CREATE TABLE IF NOT EXISTS app_collections (
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "Alumnos" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    usuario TEXT GENERATED ALWAYS AS (doc->>'Usuario') STORED,
    correo TEXT GENERATED ALWAYS AS (doc->>'Correo') STORED,
    nombre TEXT GENERATED ALWAYS AS (doc->>'Nombre') STORED,
    apellido TEXT GENERATED ALWAYS AS (doc->>'Apellido') STORED,
    rol TEXT GENERATED ALWAYS AS (doc->>'Rol') STORED,
    telefono TEXT GENERATED ALWAYS AS (doc->>'Teléfono') STORED,
    habilitado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'habilitado') = 'boolean' THEN (doc->>'habilitado')::boolean ELSE NULL END) STORED,
    codigo_curso TEXT GENERATED ALWAYS AS (doc->>'Código_Curso') STORED,
    codigo_rol TEXT GENERATED ALWAYS AS (doc->>'Código_Rol') STORED,
    codigo_institucion TEXT GENERATED ALWAYS AS (doc->>'Código_Institución') STORED
        );

CREATE TABLE IF NOT EXISTS "Maestros" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    usuario TEXT GENERATED ALWAYS AS (doc->>'Usuario') STORED,
    correo TEXT GENERATED ALWAYS AS (doc->>'Correo') STORED,
    nombre TEXT GENERATED ALWAYS AS (doc->>'Nombre') STORED,
    apellido TEXT GENERATED ALWAYS AS (doc->>'Apellido') STORED,
    rol TEXT GENERATED ALWAYS AS (doc->>'Rol') STORED,
    telefono TEXT GENERATED ALWAYS AS (doc->>'Teléfono') STORED,
    habilitado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'habilitado') = 'boolean' THEN (doc->>'habilitado')::boolean ELSE NULL END) STORED,
    codigo_institucion TEXT GENERATED ALWAYS AS (doc->>'Código_Institución') STORED,
    codigo_rol TEXT GENERATED ALWAYS AS (doc->>'Código_Rol') STORED,
    nombre_institucion TEXT GENERATED ALWAYS AS (doc->>'Nombre_Institución') STORED,
    curso JSONB GENERATED ALWAYS AS (doc->'CURSO') STORED
        );

CREATE TABLE IF NOT EXISTS "Directores" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    usuario TEXT GENERATED ALWAYS AS (doc->>'Usuario') STORED,
    correo TEXT GENERATED ALWAYS AS (doc->>'Correo') STORED,
    nombre TEXT GENERATED ALWAYS AS (doc->>'Nombre') STORED,
    apellido TEXT GENERATED ALWAYS AS (doc->>'Apellido') STORED,
    rol TEXT GENERATED ALWAYS AS (doc->>'Rol') STORED,
    telefono TEXT GENERATED ALWAYS AS (doc->>'Teléfono') STORED,
    habilitado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'habilitado') = 'boolean' THEN (doc->>'habilitado')::boolean ELSE NULL END) STORED,
    codigo_institucion TEXT GENERATED ALWAYS AS (doc->>'Código_Institución') STORED,
    codigo_rol TEXT GENERATED ALWAYS AS (doc->>'Código_Rol') STORED
        );

CREATE TABLE IF NOT EXISTS "Supervisores" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    usuario TEXT GENERATED ALWAYS AS (doc->>'Usuario') STORED,
    correo TEXT GENERATED ALWAYS AS (doc->>'Correo') STORED,
    nombre TEXT GENERATED ALWAYS AS (doc->>'Nombre') STORED,
    apellido TEXT GENERATED ALWAYS AS (doc->>'Apellido') STORED,
    rol TEXT GENERATED ALWAYS AS (doc->>'Rol') STORED,
    telefono TEXT GENERATED ALWAYS AS (doc->>'Teléfono') STORED,
    habilitado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'habilitado') = 'boolean' THEN (doc->>'habilitado')::boolean ELSE NULL END) STORED,
    codigo TEXT GENERATED ALWAYS AS (doc->>'Código') STORED,
    departamento TEXT GENERATED ALWAYS AS (doc->>'DEPARTAMENTO') STORED,
    codigo_institucion TEXT GENERATED ALWAYS AS (doc->>'Código_Institución') STORED,
    nombre_institucion TEXT GENERATED ALWAYS AS (doc->>'Nombre_Institución') STORED,
    email_verificado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'emailVerificado') = 'boolean' THEN (doc->>'emailVerificado')::boolean ELSE NULL END) STORED
        );

CREATE TABLE IF NOT EXISTS "Cursos" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    codigo TEXT GENERATED ALWAYS AS (doc->>'Código') STORED,
    nombre_curso TEXT GENERATED ALWAYS AS (doc->>'Nombre_Curso') STORED
        );

CREATE TABLE IF NOT EXISTS "Resultados" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    codigo_alumnos TEXT GENERATED ALWAYS AS (doc->>'Código_Alumnos') STORED,
    codigo_colegios TEXT GENERATED ALWAYS AS (doc->>'Código_Colegios') STORED,
    codigo_directores TEXT GENERATED ALWAYS AS (doc->>'Código_Directores') STORED,
    codigo_maestros TEXT GENERATED ALWAYS AS (doc->>'Código_Maestros') STORED,
    punteo NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'Punteo') = 'number' THEN (doc->>'Punteo')::numeric ELSE NULL END) STORED
        );

CREATE TABLE IF NOT EXISTS "Login" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    usuario TEXT GENERATED ALWAYS AS (doc->>'Usuario') STORED,
    correo TEXT GENERATED ALWAYS AS (doc->>'Correo') STORED,
    nombre TEXT GENERATED ALWAYS AS (doc->>'Nombre') STORED,
    apellido TEXT GENERATED ALWAYS AS (doc->>'Apellido') STORED,
    rol TEXT GENERATED ALWAYS AS (doc->>'Rol') STORED,
    telefono TEXT GENERATED ALWAYS AS (doc->>'Teléfono') STORED,
    habilitado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'habilitado') = 'boolean' THEN (doc->>'habilitado')::boolean ELSE NULL END) STORED,
    codigo_institucion TEXT GENERATED ALWAYS AS (doc->>'Código_Institución') STORED,
    nombre_institucion TEXT GENERATED ALWAYS AS (doc->>'Nombre_Institución') STORED,
    codigo_rol TEXT GENERATED ALWAYS AS (doc->>'Código_Rol') STORED,
    email_verificado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'emailVerificado') = 'boolean' THEN (doc->>'emailVerificado')::boolean ELSE NULL END) STORED,
    token_verificacion TEXT GENERATED ALWAYS AS (doc->>'tokenVerificacion') STORED
        );

CREATE TABLE IF NOT EXISTS "Colegio" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    codigo_institucion TEXT GENERATED ALWAYS AS (doc->>'Código_Institución') STORED,
    codigo_alumno TEXT GENERATED ALWAYS AS (doc->>'Código_Alumno') STORED,
    codigo_director TEXT GENERATED ALWAYS AS (doc->>'Código_Director') STORED,
    codigo_maestro TEXT GENERATED ALWAYS AS (doc->>'Código_Maestro') STORED,
    codigo_supervisor TEXT GENERATED ALWAYS AS (doc->>'Código_Supervisor') STORED,
    correo TEXT GENERATED ALWAYS AS (doc->>'Correo') STORED,
    departamento TEXT GENERATED ALWAYS AS (doc->>'DEPARTAMENTO') STORED,
    direccion TEXT GENERATED ALWAYS AS (doc->>'Dirección') STORED,
    nombre_completo TEXT GENERATED ALWAYS AS (doc->>'Nombre_Completo') STORED,
    telefono TEXT GENERATED ALWAYS AS (doc->>'Teléfono') STORED,
    id_colegio TEXT GENERATED ALWAYS AS (doc->>'ID_Colegio') STORED,
    email_verificado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'emailVerificado') = 'boolean' THEN (doc->>'emailVerificado')::boolean ELSE NULL END) STORED,
    habilitado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'habilitado') = 'boolean' THEN (doc->>'habilitado')::boolean ELSE NULL END) STORED
        );

CREATE TABLE IF NOT EXISTS "UserAdmin" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    usuario TEXT GENERATED ALWAYS AS (doc->>'Usuario') STORED,
    correo TEXT GENERATED ALWAYS AS (doc->>'Correo') STORED,
    nombre TEXT GENERATED ALWAYS AS (doc->>'Nombre') STORED,
    apellido TEXT GENERATED ALWAYS AS (doc->>'Apellido') STORED,
    telefono TEXT GENERATED ALWAYS AS (doc->>'Telefono') STORED,
    email_verificado BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'emailVerificado') = 'boolean' THEN (doc->>'emailVerificado')::boolean ELSE NULL END) STORED
        );

CREATE TABLE IF NOT EXISTS "codigosAcceso" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    codigo TEXT GENERATED ALWAYS AS (doc->>'codigo') STORED,
    tipo TEXT GENERATED ALWAYS AS (doc->>'tipo') STORED,
    activo BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'activo') = 'boolean' THEN (doc->>'activo')::boolean ELSE NULL END) STORED,
    codigo_institucion TEXT GENERATED ALWAYS AS (doc->>'codigoInstitucion') STORED,
    nombre_institucion TEXT GENERATED ALWAYS AS (doc->>'nombreInstitucion') STORED,
    descripcion TEXT GENERATED ALWAYS AS (doc->>'descripcion') STORED,
    generado_por TEXT GENERATED ALWAYS AS (doc->>'generadoPor') STORED,
    fecha_creacion TEXT GENERATED ALWAYS AS (COALESCE(doc #>> '{fechaCreacion,$date}', doc->>'fechaCreacion')) STORED
        );

CREATE TABLE IF NOT EXISTS "matematicas" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    semana NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'semana') = 'number' THEN (doc->>'semana')::numeric ELSE NULL END) STORED,
    tema TEXT GENERATED ALWAYS AS (doc->>'tema') STORED,
    contenido JSONB GENERATED ALWAYS AS (doc->'contenido') STORED
        );

CREATE TABLE IF NOT EXISTS "comunicacions" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    semana NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'semana') = 'number' THEN (doc->>'semana')::numeric ELSE NULL END) STORED,
    tema TEXT GENERATED ALWAYS AS (doc->>'tema') STORED,
    contenido JSONB GENERATED ALWAYS AS (doc->'contenido') STORED
        );

CREATE TABLE IF NOT EXISTS "testmatematicas" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    semana NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'semana') = 'number' THEN (doc->>'semana')::numeric ELSE NULL END) STORED,
    titulo TEXT GENERATED ALWAYS AS (doc->>'titulo') STORED,
    preguntas JSONB GENERATED ALWAYS AS (doc->'preguntas') STORED
        );

CREATE TABLE IF NOT EXISTS "testcomunicacions" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    semana NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'semana') = 'number' THEN (doc->>'semana')::numeric ELSE NULL END) STORED,
    titulo TEXT GENERATED ALWAYS AS (doc->>'titulo') STORED,
    preguntas JSONB GENERATED ALWAYS AS (doc->'preguntas') STORED
        );

CREATE TABLE IF NOT EXISTS "testAssignments" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    test_id TEXT GENERATED ALWAYS AS (COALESCE(doc->>'testId', doc #>> '{testId,$oid}')) STORED,
    test_type TEXT GENERATED ALWAYS AS (doc->>'testType') STORED,
    estado TEXT GENERATED ALWAYS AS (doc->>'estado') STORED,
    maestro_id TEXT GENERATED ALWAYS AS (doc->>'maestroId') STORED,
    institucion_id TEXT GENERATED ALWAYS AS (doc->>'institucionId') STORED,
    student_ids JSONB GENERATED ALWAYS AS (doc->'studentIds') STORED,
    fecha_asignacion TEXT GENERATED ALWAYS AS (COALESCE(doc #>> '{fechaAsignacion,$date}', doc->>'fechaAsignacion')) STORED,
    fecha_vencimiento TEXT GENERATED ALWAYS AS (COALESCE(doc #>> '{fechaVencimiento,$date}', doc->>'fechaVencimiento')) STORED
        );

CREATE TABLE IF NOT EXISTS "testResults" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    student_id TEXT GENERATED ALWAYS AS (doc->>'studentId') STORED,
    test_id TEXT GENERATED ALWAYS AS (COALESCE(doc->>'testId', doc #>> '{testId,$oid}')) STORED,
    test_type TEXT GENERATED ALWAYS AS (doc->>'testType') STORED,
    score NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'score') = 'number' THEN (doc->>'score')::numeric ELSE NULL END) STORED,
    correct_answers NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'correctAnswers') = 'number' THEN (doc->>'correctAnswers')::numeric ELSE NULL END) STORED,
    total_questions NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'totalQuestions') = 'number' THEN (doc->>'totalQuestions')::numeric ELSE NULL END) STORED,
    answers JSONB GENERATED ALWAYS AS (doc->'answers') STORED,
    submitted_at TEXT GENERATED ALWAYS AS (COALESCE(doc #>> '{submittedAt,$date}', doc->>'submittedAt')) STORED
        );

CREATE TABLE IF NOT EXISTS "notifications" (
            seq BIGSERIAL PRIMARY KEY,
            doc_id TEXT NOT NULL UNIQUE,
            doc JSONB NOT NULL,
    type TEXT GENERATED ALWAYS AS (doc->>'type') STORED,
    title TEXT GENERATED ALWAYS AS (doc->>'title') STORED,
    student_id TEXT GENERATED ALWAYS AS (doc->>'studentId') STORED,
    test_id TEXT GENERATED ALWAYS AS (COALESCE(doc->>'testId', doc #>> '{testId,$oid}')) STORED,
    test_type TEXT GENERATED ALWAYS AS (doc->>'testType') STORED,
    score NUMERIC GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'score') = 'number' THEN (doc->>'score')::numeric ELSE NULL END) STORED,
    read BOOLEAN GENERATED ALWAYS AS (CASE WHEN jsonb_typeof(doc->'read') = 'boolean' THEN (doc->>'read')::boolean ELSE NULL END) STORED,
    student_institution TEXT GENERATED ALWAYS AS (doc->>'studentInstitution') STORED,
    created_at TEXT GENERATED ALWAYS AS (COALESCE(doc #>> '{createdAt,$date}', doc->>'createdAt')) STORED
        );

INSERT INTO app_collections (name) VALUES
    ('Alumnos'),
    ('Maestros'),
    ('Directores'),
    ('Supervisores'),
    ('Cursos'),
    ('Resultados'),
    ('Login'),
    ('Colegio'),
    ('UserAdmin'),
    ('codigosAcceso'),
    ('matematicas'),
    ('comunicacions'),
    ('testmatematicas'),
    ('testcomunicacions'),
    ('testAssignments'),
    ('testResults'),
    ('notifications')
ON CONFLICT (name) DO NOTHING;
