export default {
    template : `
     <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
        <h3 class="text-center mb-4">Register</h3>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" v-model="email" class="form-control" placeholder="Enter email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" class="form-control" placeholder="Password">
        </div>
        <div class="form-group">
          <label>Role</label>
          <input type="role" v-model="role" class="form-control" placeholder="role">
        </div>
      
        <button class="btn btn-primary btn-block" @click="submitLogin">Register</button>

      
      </div>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            role : null,
        }
    },
    methods : {

        async submitLogin(){
            const res = await fetch(location.origin+'/register', 
                {
                    method : 'POST', 
                    headers:{'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password' : this.password, 'role' : this.role,})
                })

            if (res.ok){
                console.log('user registered')
                const data = await res.json()
                console.log(data)
              
                
            }
        }
    }
}