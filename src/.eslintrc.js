module.exports = {
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        'vue/multi-word-component-names': 'off', // 可选，禁用多词组件名称规则
    },
};