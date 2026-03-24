(() => {
    const bindFallbackTocLinks = () => {
        const tocRoot = document.querySelector("#toc");
        const contentRoot = document.querySelector(".article-content .content");
        if (!tocRoot || !contentRoot) return;

        const tocLinks = Array.from(tocRoot.querySelectorAll("a[href^='#']"));
        const headings = Array.from(contentRoot.querySelectorAll("h1, h2, h3, h4, h5, h6"));
        if (!tocLinks.length || !headings.length) return;

        const normalizeText = (text) => (text || "").replace(/\s+/g, " ").trim();
        const headingMap = new Map();

        headings.forEach((heading, index) => {
            const key = normalizeText(heading.textContent);
            if (!heading.id) heading.id = `toc-heading-${index + 1}`;
            if (!headingMap.has(key)) headingMap.set(key, []);
            headingMap.get(key).push(heading);
        });

        tocLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            let id = href.startsWith("#") ? decodeURIComponent(href.slice(1)) : "";
            let target = id ? document.getElementById(id) : null;
            if (!target) {
                const key = normalizeText(link.textContent);
                const candidates = headingMap.get(key) || [];
                target = candidates.shift();
                if (!target) return;
                id = target.id;
                link.setAttribute("href", `#${id}`);
            }

            link.addEventListener("click", (event) => {
                event.preventDefault();
                const targetTop = target.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top: targetTop, behavior: "smooth" });
                history.replaceState(null, "", `#${id}`);
            });
        });
    };

    const initTocbot = () => {
        if (!window.tocbot) {
            bindFallbackTocLinks();
            return;
        }
        const tocRoot = document.querySelector("#toc .toc");
        const contentRoot = document.querySelector(".article-content .content");
        if (!tocRoot || !contentRoot) {
            bindFallbackTocLinks();
            return;
        }

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
