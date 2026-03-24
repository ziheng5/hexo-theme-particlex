(() => {
    const bindSmoothScroll = (tocRoot) => {
        const links = Array.from(tocRoot.querySelectorAll("a[href^='#']"));
        links.forEach((link) => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href") || "";
                const id = href.startsWith("#") ? decodeURIComponent(href.slice(1)) : "";
                const target = id ? document.getElementById(id) : null;
                if (!target) {
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                const targetTop = target.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top: targetTop, behavior: "smooth" });
                history.replaceState(null, "", `#${id}`);
            });
        });
    };

    const normalizeTocLinksByOrder = (tocRoot, contentRoot) => {
        const links = Array.from(tocRoot.querySelectorAll("a"));
        const headings = Array.from(contentRoot.querySelectorAll("h1, h2, h3, h4, h5, h6"));
        if (!links.length || !headings.length) return;

        const count = Math.min(links.length, headings.length);
        for (let i = 0; i < count; i++) {
            const heading = headings[i];
            if (!heading.id) heading.id = `toc-heading-${i + 1}`;
            links[i].setAttribute("href", `#${heading.id}`);
            links[i].setAttribute("title", (heading.textContent || "").trim());
        }
    };

    const renderFallbackToc = () => {
        const tocRoot = document.querySelector("#toc .toc");
        const contentRoot = document.querySelector(".article-content .content");
        if (!tocRoot || !contentRoot) return;

        const headings = Array.from(contentRoot.querySelectorAll("h1, h2, h3, h4, h5, h6"));
        if (!headings.length) return;

        const list = document.createElement("ol");
        list.className = "toc-list";
        headings.forEach((heading, index) => {
            if (!heading.id) heading.id = `toc-heading-${index + 1}`;
            const text = (heading.textContent || "").trim();
            if (!text) return;

            const item = document.createElement("li");
            item.className = "toc-list-item";

            const link = document.createElement("a");
            link.className = "toc-link";
            link.href = `#${heading.id}`;
            link.textContent = text;
            link.title = text;

            item.appendChild(link);
            list.appendChild(item);
        });

        tocRoot.innerHTML = "";
        tocRoot.appendChild(list);
        bindSmoothScroll(tocRoot);
    };

    const initTocbot = () => {
        if (!window.tocbot) {
            renderFallbackToc();
            return;
        }
        const tocRoot = document.querySelector("#toc .toc");
        const contentRoot = document.querySelector(".article-content .content");
        if (!tocRoot || !contentRoot) {
            renderFallbackToc();
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
        normalizeTocLinksByOrder(tocRoot, contentRoot);
        bindSmoothScroll(document.querySelector("#toc"));
    };

    window.addEventListener("load", initTocbot);
})();
