const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME || "dbgraduat";

// Verificar que la URI esté configurada
if (!uri) {
    console.error('❌ MONGODB_URL no está configurada en el archivo .env');
    console.error('💡 Asegúrate de tener MONGODB_URL=mongodb+srv://... en tu archivo .env');
    process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
});

let db;

async function connectDB() {
    try {
        console.log("🔄 Intentando conectar a MongoDB Atlas...");
        console.log(`📊 Base de datos: ${dbName}`);
        console.log(`🌐 Cluster: dbgraduat`);
        
        await client.connect();
        console.log("✅ Cliente MongoDB conectado");
        
        
        db = client.db(dbName);
        console.log(`✅ Base de datos "${dbName}" seleccionada`);
        
        // Probar la conexión con ping
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Ping exitoso - Conexión verificada");
        
        console.log("🎉 Conectado a MongoDB Atlas exitosamente");
        return db;
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB Atlas:");
        console.error("   Tipo:", error.name);
        console.error("   Código:", error.code);
        console.error("   Mensaje:", error.message);
        
        if (error.code === 8000) {
            console.error("\n🔐 Error de autenticación - Soluciones:");
            console.error("   1. Verifica usuario y contraseña en tu archivo .env");
            console.error("   2. Ve a MongoDB Atlas → Database Access");
            console.error("   3. Asegúrate de que el usuario tenga rol 'Read and write to any database'");
            console.error("   4. Ve a Network Access y autoriza tu IP (0.0.0.0/0 para todas)");
            console.error("   5. Verifica que el cluster 'dbgraduat' esté activo");
        } else if (error.code === 6) {
            console.error("\n🌐 Error de red - Soluciones:");
            console.error("   1. Verifica tu conexión a internet");
            console.error("   2. Ve a Network Access en MongoDB Atlas");
            console.error("   3. Agrega tu IP actual o usa 0.0.0.0/0");
        }
        
        throw error;
    }
}

async function getDB() {
    if (!db) {
        await connectDB();
    }
    return db;
}

async function closeDB() {
    try {
        await client.close();
        console.log("🔌 Conexión a MongoDB cerrada");
    } catch (error) {
        console.error("❌ Error al cerrar conexión:", error);
    }
}

// Función para crear las colecciones con validación
async function createCollections() {
    try {
        const database = await getDB();
        
        // 1. Alumnos
        await database.createCollection("Alumnos", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Apellido", "Código_Curso", "Código_Rol", "Código_Institución", "Correo", "Nombre", "Rol", "Teléfono", "Usuario"],
                    properties: {
                        Apellido: { bsonType: "string" },
                        Código_Curso: { bsonType: "string" },
                        Código_Rol: { bsonType: "string" },
                        Código_Institución: { bsonType: "string" },
                        Correo: { bsonType: "string" },
                        Nombre: { bsonType: "string" },
                        Rol: { bsonType: "string" },
                        Teléfono: { bsonType: "string" },
                        Usuario: { bsonType: "string" }
                    }
                }
            }
        });

        // 2. Maestros
        await database.createCollection("Maestros", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Apellido", "Código_Institución", "Código_Rol", "Correo", "CURSO", "Nombre", "Rol", "Teléfono", "Usuario"],
                    properties: {
                        Apellido: { bsonType: "string" },
                        Código_Institución: { bsonType: "string" },
                        Código_Rol: { bsonType: "string" },
                        Correo: { bsonType: "string" },
                        CURSO: { bsonType: "string" },
                        Nombre: { bsonType: "string" },
                        Rol: { bsonType: "string" },
                        Teléfono: { bsonType: "string" },
                        Usuario: { bsonType: "string" }
                    }
                }
            }
        });

        // 3. Directores
        await database.createCollection("Directores", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Apellido", "Código_Rol", "Código_Institución", "Correo", "Nombre", "Rol", "Teléfono", "Usuario"],
                    properties: {
                        Apellido: { bsonType: "string" },
                        Código_Rol: { bsonType: "string" },
                        Código_Institución: { bsonType: "string" },
                        Correo: { bsonType: "string" },
                        Nombre: { bsonType: "string" },
                        Rol: { bsonType: "string" },
                        Teléfono: { bsonType: "string" },
                        Usuario: { bsonType: "string" }
                    }
                }
            }
        });

        // 4. Supervisores
        await database.createCollection("Supervisores", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Apellido", "Código", "Correo", "DEPARTAMENTO", "Nombre", "Rol", "Teléfono", "Usuario"],
                    properties: {
                        Apellido: { bsonType: "string" },
                        Código: { bsonType: "string" },
                        Correo: { bsonType: "string" },
                        DEPARTAMENTO: { bsonType: "string" },
                        Nombre: { bsonType: "string" },
                        Rol: { bsonType: "string" },
                        Teléfono: { bsonType: "string" },
                        Usuario: { bsonType: "string" }
                    }
                }
            }
        });

        // 5. Cursos
        await database.createCollection("Cursos", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Código", "Nombre_Curso"],
                    properties: {
                        Código: { bsonType: "string" },
                        Nombre_Curso: { bsonType: "string" }
                    }
                }
            }
        });

        // 6. Resultados
        await database.createCollection("Resultados", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Código_Alumnos", "Código_Colegios", "Código_Directores", "Código_Maestros", "Punteo"],
                    properties: {
                        Código_Alumnos: { bsonType: "string" },
                        Código_Colegios: { bsonType: "string" },
                        Código_Directores: { bsonType: "string" },
                        Código_Maestros: { bsonType: "string" },
                        Punteo: { bsonType: "double" }
                    }
                }
            }
        });

        // 7. Login
        await database.createCollection("Login", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Apellido", "Código_Institución", "Código_Rol", "Contraseña", "Correo", "Nombre", "Rol", "Teléfono", "Usuario"],
                    properties: {
                        Apellido: { bsonType: "string" },
                        Código_Institución: { bsonType: "string" },
                        Código_Rol: { bsonType: "string" },
                        Contraseña: { bsonType: "string" },
                        Correo: { bsonType: "string" },
                        Nombre: { bsonType: "string" },
                        Rol: { bsonType: "string" },
                        Teléfono: { bsonType: "string" },
                        Usuario: { bsonType: "string" }
                    }
                }
            }
        });

        // 8. Colegio
        await database.createCollection("Colegio", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["Código_Institución", "Código_Alumno", "Código_Director", "Código_Maestro", "Correo", "DEPARTAMENTO", "Dirección", "ID_Colegio", "Nombre_Completo", "Teléfono"],
                    properties: {
                        Código_Institución: { bsonType: "string" },
                        Código_Alumno: { bsonType: "string" },
                        Código_Director: { bsonType: "string" },
                        Código_Maestro: { bsonType: "string" },
                        Correo: { bsonType: "string" },
                        DEPARTAMENTO: { bsonType: "string" },
                        Dirección: { bsonType: "string" },
                        ID_Colegio: { bsonType: "string" },
                        Nombre_Completo: { bsonType: "string" },
                        Teléfono: { bsonType: "string" }
                    }
                }
            }
        });

        console.log("✅ Todas las colecciones fueron creadas correctamente.");
    } catch (error) {
        if (error.code === 48) {
            console.log("ℹ️ Las colecciones ya existen.");
        } else {
            console.error("❌ Error al crear las colecciones:", error);
        }
    }
}

module.exports = {
    connectDB,
    getDB,
    closeDB,
    createCollections
};
