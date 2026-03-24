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
            this.bindPostTocLinks();
        });
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        bindPostTocLinks() {
            const tocRoot = document.querySelector("#toc");
            if (!tocRoot) return;

            const tocLinks = Array.from(tocRoot.querySelectorAll("a[href^='#']"));
            const headings = Array.from(
                document.querySelectorAll(
                    ".article-content .content h1, .article-content .content h2, .article-content .content h3, .article-content .content h4, .article-content .content h5, .article-content .content h6"
                )
            );
            if (!tocLinks.length || !headings.length) return;

            const count = Math.min(tocLinks.length, headings.length);
            for (let i = 0; i < count; i++) {
                const heading = headings[i];
                const tocLink = tocLinks[i];
                if (!heading.id) heading.id = `toc-heading-${i + 1}`;

                tocLink.setAttribute("href", `#${heading.id}`);
                tocLink.addEventListener("click", (event) => {
                    event.preventDefault();
                    const target = document.getElementById(heading.id);
                    if (!target) return;

                    const targetTop = target.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({
                        top: targetTop,
                        behavior: "smooth",
                    });
                    history.replaceState(null, "", `#${heading.id}`);
                });
            }
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
