module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    plugins: [
    ],
    rules: {
        "no-console": "error",
        "import/first": "error",
        "import/order": ["error", { alphabetize: { order: "asc" } }],
    }
}
