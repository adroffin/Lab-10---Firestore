import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { TextField, Button, Box } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Componente que muestra la parte de los inputs.
const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Se obtiene la imagen y se guarda en el estado de image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Funcion que maneja el añadir una receta a la lista y a la coleccion.
  // Uso de uploadBytes: Sube la imagen al cloud storage de firebase, haciendo referencia a donde se guardara y el archivo que se guardara.
  // Uso de getDownloadURL: Obtiene la URL publica de la imagen para guardarla en la coleccion.
  const handleAddRecipe = async (e) => {
    e.preventDefault();
    let imageUrl = "";

    if (image) {
      const imageRef = ref(storage, `recipes/${Date.now()}_${image.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, image);

        imageUrl = await getDownloadURL(imageRef);
      } catch (err) {
        console.error("Error uploading image:", err);
        return;
      }
    }

    try {
      await addDoc(collection(db, "recipes"), {
        title,
        description,
        imageUrl,
      });

      // Se limpian los campos al finalizar la insercion
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Error adding recipe: ", err);
    }
  };

  // "Formulario" para que el usuario ingrese el titulo, descripcion e imagen de la receta.
  return (
    <Box
      component="form"
      onSubmit={handleAddRecipe}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}
    >
      <TextField
        label="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        multiline
        minRows={3}
      />
      {/* Input para seleccionar la imagen */}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <Button type="submit" variant="contained" color="primary">
        Add Recipe
      </Button>
    </Box>
  );
};

export default AddRecipe;
