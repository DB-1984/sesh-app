// src/App.jsx
import React from "react";

// Adjust the import path according to where shadcn put it
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Hello, ShadCN!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test card using ShadCN components and TailwindCSS.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
