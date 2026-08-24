

export default {
  template: `
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
        <h3 class="text-center mb-4">Login</h3>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" v-model="email" class="form-control" placeholder="Enter email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" class="form-control" placeholder="Password">
        </div>
        <button class="btn btn-primary btn-block" @click="submitLogin">Login</button>
        <p class="text-danger mt-3" v-if="error">{{ error }}</p>
      </div>
    </div>
  `,
  data() {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  methods: {
    async submitLogin() {
      try {
        const res = await fetch(location.origin + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (!res.ok) {
          this.error = "Invalid credentials. Please try again.";
          return;
        }

        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data));

        this.$store.commit('setUser');
        this.$router.push('/feed');
      } catch (err) {
        this.error = "Something went wrong. Please try again later.";
      }
    }
  }
};
