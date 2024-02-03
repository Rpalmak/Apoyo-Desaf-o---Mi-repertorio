const express = require("express");
const { CLIENT_RENEG_LIMIT } = require("tls");
const fs = require("fs").promises;
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// GET
app.get("/canciones", async (req, res) => {
    try {
        const data = await fs.readFile("repertorio.json", "utf-8");
        const canciones = JSON.parse(data);
        res.json(canciones);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener las canciones");
    }
});

// POST
app.post("/canciones", async (req, res) => {
    try {
        const data = await fs.readFile("repertorio.json", "utf-8");
        const canciones = JSON.parse(data);

        const nuevaCancion = req.body;
        canciones.push(nuevaCancion);

        await fs.writeFile("repertorio.json", JSON.stringify(canciones, null, 2), "utf-8");

        res.json({ message: "Canción agregada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al agregar la canción");
    }
});

// PUT
app.put("/canciones/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await fs.readFile("repertorio.json", "utf-8");
        let canciones = JSON.parse(data);

        const index = canciones.findIndex((c) => c.id === id);
        if (index !== -1) {
            canciones[index] = req.body;

            await fs.writeFile("repertorio.json", JSON.stringify(canciones, null, 2), "utf-8");

            res.json({ message: "Canción editada exitosamente" });
        } else {
            res.status(404).json({ message: "Canción no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al editar la canción");
    }
});


//DELETE
app.delete("/canciones/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await fs.readFile("repertorio.json", "utf-8");
        let canciones = JSON.parse(data);

        const index = canciones.findIndex((c) => c.id === Number(id));
        if (index !== -1) {
            canciones = canciones.filter((c) => c.id !== Number(id));
            await fs.writeFile("repertorio.json", JSON.stringify(canciones, null, 2), "utf-8");
            res.json({ message: "Canción eliminada exitosamente" });
        } else {
            console.log("Canción no encontrada:", id);
            res.status(404).json({ message: "Canción no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la canción");
    }
});





// Función para obtener el repertorio
async function getRepertorio() {
    try {
        const data = await fs.readFile("repertorio.json", "utf-8");
        const canciones = JSON.parse(data);
        console.log("Repertorio obtenido:", canciones);
        return canciones;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener el repertorio");
    }
}

app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
