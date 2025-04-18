// App.js
import React from "react";
import RecipesList from "./components/RecipesList";
import AddRecipe from "./components/AddRecipe";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Firestore Recipe Manager
      </Typography>
      <AddRecipe />
      <RecipesList />
    </Container>
  );
}

export default App;
