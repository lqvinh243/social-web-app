<template>
    <div class="header bg-light">
        <nav
            class="
              navbar navbar-expand-lg navbar-light
              bg-light
              justify-content-between
              align-middle
            "
        >
            <div class="logo">
                <h1 class="navbar-brand text-uppercase p-0 m-0">
                    Mercury
                </h1>
            </div>

            <form class="search_form">
                <input id="search" type="text" name="search" value="" title="Enter to Search">
                <div class="search_icon" style="opacity: 0.3">
                    <span class="material-icons">search</span>
                    <span>Enter to Search</span>
                </div>
                <div class="close_search" style="opacity: 1">
                    ×
                </div>
                <button type="submit" style="display: none">
                    Search
                </button>
            </form>

            <div class="menu">
                <ul class="navbar-nav flex-row">
                    <el-tooltip class="item" effect="dark" content="Home" placement="bottom-start">
                        <li class="nav-item px-2">
                            <div class="nav-link">
                                <nuxt-link to="/">
                                    <i class="el-icon-s-home" />
                                </nuxt-link>
                            </div>
                        </li>
                    </el-tooltip>

                    <el-tooltip class="item" effect="dark" content="Chat message" placement="bottom-start">
                        <li class="nav-item px-2">
                            <div class="nav-link">
                                <nuxt-link to="/chat">
                                    <i class="el-icon-chat-round" />
                                </nuxt-link>
                            </div>
                        </li>
                    </el-tooltip>

                    <el-tooltip class="item" effect="dark" content="Find new user" placement="bottom-start">
                        <li class="nav-item px-2">
                            <div class="nav-link">
                                <nuxt-link to="/new-user">
                                    <i class="el-icon-user-solid" />
                                </nuxt-link>
                            </div>
                        </li>
                    </el-tooltip>
                    <li class="nav-item dropdown" style="opacity: 1">
                        <span
                            id="navbarDropdown"
                            class="nav-link position-relative"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <span class="material-icons" style="color: crimson">
                                favorite
                            </span>
                            <span class="notify_length">3</span>
                        </span>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown" style="transform: translateX(75px)" />
                    </li>
                    <v-menu offset-y>
                        <template #activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <span
                                    id="navbarDropdown"
                                    class="nav-link dropdown-toggle"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <img
                                        src="https://res.cloudinary.com/devat-channel/image/upload/v1631811242/v-network/vj9pee0vwrifc1bugijz.jpg"
                                        class="medium-avatar"
                                    >
                                </span>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item v-for="n in dropdownSelection" :key="n.id" @click="handleRedirect(n.id)">
                                <v-list-item-title>
                                    {{ n.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </ul>
            </div>
        </nav>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import eventBus from '~/plugins/event-bus';

export default Vue.extend({
    data: () => ({
        items: [
            { title: 'Điện thoại di động', id: 'mobile' },
            { title: 'Máy tính xách tay', id: 'laptop' }
        ],
        profiles: [
            { title: 'Đăng nhập', id: 'login', isAuth: false },
            { title: 'Đăng ký', id: 'register', isAuth: false },
            { title: 'Thông tin cá nhân', id: 'profile', isAuth: true },
            { title: 'Đăng xuất', id: 'logout', isAuth: true }],
        listSearch: [],
        loading: false,
        search: null,
        select: null,
    }),
    computed: {
        dropdownSelection():any {
            return this.profiles.filter((item:any) => item.isAuth === this.$auth.isAuthenticated());
        },

        showMenuBar():boolean {
            return this.$auth.isAuthenticated();
        }
    },

    watch: {
        search(val) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                if (val || val === '' || val.length) {
                    if (this.$route.path !== '/product')
                        this.$router.push(`/product?query=${val}`);
                    else eventBus.$emit('CHANGE_QUERY_SEARCH', val);
                }
                this.loading = false;
            }, 2000);
        },
    },
    methods: {
        ...mapActions('auth', [
            'clearAuthentication',
        ]),
        handleDrawer() {
            this.$emit('emitDrawer');
        },
        querySelections(v: any) {
            this.loading = true;
            // Simulated ajax query
            setTimeout(() => {
                if (this.$route.path !== '/product')
                    this.$router.push(`/product?query=${v}`);

                this.loading = false;
            }, 2000);
        },
        handleRedirect(path: string) {
            switch (path) {
            case 'logout':
                this.clearAuthentication();
                this.$router.push('/login');
                break;
            case 'my-profile':
            case 'profile':
            case 'register':
            case 'login':
                this.$router.push(`/${path}`);
                break;
            }
        }
    }
});
</script>

<style scoped>
    .v-autocomplete__content .v-list__tile{
        height: auto;
    }

    .search-header{
        width: 30%
    }

    i {
        font-size:30px;
    }

    i:hover{
        cursor: pointer;
    }
</style>
