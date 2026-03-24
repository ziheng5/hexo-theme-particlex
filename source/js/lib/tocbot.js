(() => {
    const initTocbot = () => {
        if (!window.tocbot) return;
        const tocRoot = document.querySelector("#toc .toc");
        const contentRoot = document.querySelector(".article-content .content");
        if (!tocRoot || !contentRoot) return;

        window.tocbot.destroy();
        window.tocbot.init({
            tocSelector: "#toc .toc",
            contentSelector: ".article-content .content",
            headingSelector: "h1, h2, h3, h4, h5, h6",
            hasInnerContainers: true,
            collapseDepth: 6,
            scrollSmoothOffset: -90,
            headingsOffset: 90,
        });
    };

    window.addEventListener("load", initTocbot);
})();
