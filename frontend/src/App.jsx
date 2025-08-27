import React from 'react';

// This is a simple React component that uses various Tailwind CSS classes
// to create a styled card. If Tailwind is working, this card will have a
// shadow, rounded corners, and the text and button will be styled.

const App = () => {
  return (
    // The main container. We'll use a flexbox to center the content.
    // The min-h-screen class ensures the container takes up the full
    // viewport height, and the flex, items-center, and justify-center
    // classes center the card both vertically and horizontally.
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      
      {/* This is the card container. We are applying several common
          Tailwind utility classes for styling. */}
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        
        {/* The main heading for the card. */}
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Tailwind is Working! 🎉
        </h1>
        
        {/* A paragraph of text with a different color. */}
        <p className="mb-6 text-gray-600">
          This is a sample card styled completely with Tailwind CSS.
          You can tell it's working because of the shadows, rounded corners, and
          custom fonts.
        </p>
        
        {/* A button with an interactive hover effect. The hover: prefix
            is a great way to test if Tailwind's JIT functionality is live. */}
        <button
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Check out the Styles
        </button>
        
      </div>
    </div>
  );
};

export default App;
