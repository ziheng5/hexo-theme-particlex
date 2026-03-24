const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
        this.$nextTick(() => {
            this.normalizePostTocAnchors();
            this.enablePostTocSmoothScroll();
        });
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        normalizePostTocAnchors() {
            const tocRoot = document.querySelector("#toc");
            if (!tocRoot) return;

            const tocLinks = Array.from(tocRoot.querySelectorAll("a[href^='#']"));
            const headings = Array.from(
                document.querySelectorAll(
                    ".article-content .content h1, .article-content .content h2, .article-content .content h3, .article-content .content h4, .article-content .content h5, .article-content .content h6"
                )
            );
            if (!tocLinks.length || !headings.length) return;

            const normalizeText = (text) => (text || "").replace(/\s+/g, " ").trim();
            const usedIds = new Set(headings.map((heading) => heading.id).filter(Boolean));
            const headingTextMap = new Map();

            headings.forEach((heading) => {
                const key = normalizeText(heading.textContent);
                if (!headingTextMap.has(key)) headingTextMap.set(key, []);
                headingTextMap.get(key).push(heading);
            });

            const ensureHeadingId = (heading, index) => {
                if (heading.id) return heading.id;
                let id = `toc-heading-${index + 1}`;
                let seed = 1;
                while (usedIds.has(id)) {
                    seed += 1;
                    id = `toc-heading-${index + 1}-${seed}`;
                }
                heading.id = id;
                usedIds.add(id);
                return id;
            };

            tocLinks.forEach((tocLink, index) => {
                const href = tocLink.getAttribute("href") || "";
                const rawId = href.startsWith("#")
                    ? decodeURIComponent(href.slice(1))
                    : "";
                if (rawId && document.getElementById(rawId)) return;

                const key = normalizeText(tocLink.textContent);
                const candidates = headingTextMap.get(key) || [];
                const heading = candidates.shift();
                if (!heading) return;

                const id = ensureHeadingId(heading, index);
                tocLink.setAttribute("href", `#${id}`);
            });
        },
        enablePostTocSmoothScroll() {
            const tocRoot = document.querySelector("#toc");
            if (!tocRoot) return;

            const tocLinks = Array.from(tocRoot.querySelectorAll("a[href^='#']"));
            tocLinks.forEach((tocLink) => {
                tocLink.addEventListener("click", (event) => {
                    const href = tocLink.getAttribute("href") || "";
                    if (!href.startsWith("#")) return;

                    const id = decodeURIComponent(href.slice(1));
                    const target = id ? document.getElementById(id) : null;
                    if (!target) return;

                    event.preventDefault();
                    const targetTop = target.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({
                        top: targetTop,
                        behavior: "smooth",
                    });
                    history.replaceState(null, "", `#${id}`);
                });
            });
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
    },
});
app.mount("#layout");
