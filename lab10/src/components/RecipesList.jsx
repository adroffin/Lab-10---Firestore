import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

// Componente que mostrara la lista de recetas
const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // El componente escucha cambios en la coleccion de "recipes" y actualiza el estado cuando dicha coleccion de firestore cambia
  useEffect(() => {
    const colRef = collection(db, "recipes");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesData);
    });

    return () => unsubscribe();
  }, []);

  // Funcion que maneja la edicion de las recetas
  const handleEdit = (recipe) => {
    setEditingRecipeId(recipe.id);
    setEditTitle(recipe.title);
    setEditDescription(recipe.description);
  };

  // En base al id de la receta, busca el documentos y permite editar el titulo y la descripcion de la receta.
  const handleSave = async (recipeId) => {
    try {
      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, {
        title: editTitle,
        description: editDescription,
      });
      setEditingRecipeId(null);
    } catch (err) {
      console.error("Error updating recipe:", err);
    }
  };

  const handleCancel = () => {
    setEditingRecipeId(null);
  };

  // Eliminacion de una receta que ya esta en la lista.
  const handleDelete = async (recipeId) => {
    try {
      await deleteDoc(doc(db, "recipes", recipeId));
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  // Interfaz que se le mostrara al usuario.
  // Se mostrara cada receta con su imagen en formato de avatar, titulo y descripcion.
  return (
    <List>
      {recipes.map((recipe) => (
        <ListItem
          key={recipe.id}
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {/* Mostrar imagen si existe */}
          {recipe.imageUrl && (
            <Avatar
              src={recipe.imageUrl}
              alt={recipe.title}
              sx={{ width: 200, height: 200 }}
            />
          )}
          {editingRecipeId === recipe.id ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                label="Recipe Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <TextField
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              {/* Botones de cada receta en la lista para guardar la edicion si es que se realizo. */}
              <IconButton onClick={() => handleSave(recipe.id)}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              <ListItemText
                primary={recipe.title}
                secondary={recipe.description}
              />
              {/* Operaciones del crud (editar y eliminar) para cada receta en la lista */}
              <IconButton onClick={() => handleEdit(recipe)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(recipe.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default RecipesList;
