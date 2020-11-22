export default {
    bind(el, {value}) {
        M.Tooltip.init(el, {html: value});
    },
    // Чтобы тултипы не сохранялись, когда открываем другие страницы, чтобы не было утечек памяти
    unbind(el) {
        const tooltip = M.Tooltip.getInstance(el);

        if (tooltip && tooltip.destroy) {
            tooltip.destroy();
        }
    }
}