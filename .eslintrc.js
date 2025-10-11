module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  ignorePatterns: [
    'src/lib/security/**/*.ts' // Ignora i file di sicurezza durante lo sviluppo
  ],
  rules: {
    // Consenti parametri unused con prefisso _
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }
    ]
  }
};