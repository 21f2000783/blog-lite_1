const Home = {
    template : `<h1> this is home </h1>`
}

import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import BlogsListPage from "../pages/BlogsListPage.js";
import DisplayBlogPage from "../pages/DisplayBlogPage.js"
import AdminDashboardPage from "../pages/AdminDashboardPage.js"
import ExploreUserPage from "../pages/ExploreUserPage.js"
import UserListPage from "../pages/UserListPage.js";
import UserProfile from "../pages/UserProfile.js";

import store from './store.js'




const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/feed', component : BlogsListPage, meta : {requiresLogin : true}},
    {path : '/blogs/:id', component : DisplayBlogPage ,props : true ,meta : {requireLogin : true}},
    {path : '/admin-dashboard', component : AdminDashboardPage, meta : {requiresLogin : true, role : "admin"}},
    {path : '/explore', component : ExploreUserPage},
    {path : '/user', component : UserListPage, meta : {requiresLogin : true, role : "admin"}},
    {path : '/profile', component : UserProfile,}
  
]

const router = new VueRouter({
    routes
})

// Navigation Guards

router.beforeEach((to, from, next) =>  {
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorized')
            next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;