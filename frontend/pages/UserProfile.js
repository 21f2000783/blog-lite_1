export default {
  name: 'UserProfile',

  data() {
    return {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        avatar: 'https://via.placeholder.com/100' // Default profile pic
      }
    };
  },

  template: `
    <div class="container mt-5">
      <div class="card p-4 shadow-sm" style="max-width: 400px; margin: auto;">
        <div class="text-center">
          <img :src="user.avatar" alt="Profile Image" class="rounded-circle mb-3" width="100" height="100">
          <h3>{{ user.name }}</h3>
          <p class="text-muted">{{ user.email }}</p>
          <span class="badge bg-primary">{{ user.role }}</span>
        </div>
      </div>
    </div>
  `
}
