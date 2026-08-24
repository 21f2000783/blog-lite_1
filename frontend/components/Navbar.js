export default {
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <router-link class="navbar-brand" to="/">MyApp</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>

          <template v-if="!$store.state.loggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item" v-if="$store.state.role === 'admin'">
              <router-link class="nav-link" to="/admin-dashboard">Admin Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="$store.state.role === 'admin' ">
              <router-link class = "nav-link" to = "/user">Users</router-link>

            <li class="nav-item" v-if="$store.state.role === 'user'">
              <router-link class="nav-link" to="/UserProfile">Profile</router-link>
            </li>
             <li class="nav-item" v-if="$store.state.role === 'user'">
              <router-link class="nav-link" to="/feed">Feed</router-link>
            </li>
            <li class="nav-item" v-if="$store.state.role === 'user'">
              <router-link class="nav-link" to="/explore">Explore</router-link>
            </li>
          </template>
        </ul>

        <div class="d-flex" v-if="$store.state.loggedIn">
          <button @click="$store.commit('logout')" class="btn btn-outline-light">Logout</button>
        </div>
      </div>
    </nav>
  `
}
