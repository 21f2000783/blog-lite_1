// import { fetchWithAuth } from "../utils/fetchWithAuth"
// # // <div v-for="user in users"> {{user.email}} </div>
import User from "../components/User.js"

export default {
    template :  `
        <div class = "p-4">
            <h1> Users </h1>
            <input placeholder = "search" @input="search"  v-model = "searchQuery"/>
           
            <User v-for="user in filteredUsers" :key="user.id" :email="user.email" :id="user.id" :followers="user.num_following" :posts="user.num_post" />
        </div>
    `,
    data() {
        return {
            users : [],
            searchQuery : null,
        }
    },
    computed: {
        filteredUsers() {
            return this.users.filter(
            user => user.id != this.$store.state.user_id
      );
    }
  },

    methods : {
        async search(){
                const token = this.$store.state.auth_token;
    
                if (!token) {
                console.warn('No auth token found.');
                this.$router.push('/login')
                return; // or redirect to login
            }

                
                const res = await fetch('/api/users?query='+this.searchQuery, {

                method : 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': token // if needed
                }

            });
             if (res.ok){
                this.users = await res.json()
            }else {
                console.warn('error fetching')
            }
        }
   },           
async mounted() {
                const token = this.$store.state.auth_token;
    
                if (!token) {
                console.warn('No auth token found.');
                this.$router.push('/login')
                return; // or redirect to login
            }
    console.log('mounted ran')
    const res = await fetch(`${location.origin}/api/users`, {
        headers: {
            'Authentication-Token': token
            }
        });
        if (res.ok){
            this.users = await res.json()
        }else {
            console.log("error")
        }
    },
    //  local registration for component User.js
    components : {   
        User,
    }


}