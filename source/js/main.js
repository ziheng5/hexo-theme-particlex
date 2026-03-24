const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            isDark: false,
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
        this.initTheme();
        this.render();
    },
    methods: {
        initTheme() {
            const stored = localStorage.getItem("particlex-theme");
            if (stored === "dark" || stored === "light") {
                this.isDark = stored === "dark";
            } else {
                this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            }
            document.body.classList.toggle("dark-mode", this.isDark);
        },
        toggleTheme() {
            this.isDark = !this.isDark;
            localStorage.setItem("particlex-theme", this.isDark ? "dark" : "light");
            document.body.classList.toggle("dark-mode", this.isDark);
        },
        render() {
            for (let i of this.renderers) i();
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
