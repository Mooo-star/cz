export const getComponentTemplate = (name: string) => {
  return `import React from 'react';

export const ${name} = () => {
  return (
    <div>
      <h1>${name}</h1>
    </div>
  );
};
`;
};