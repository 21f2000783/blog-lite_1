export default {
    template : `
        <div>
        <h1>All Users</h1>
        
        <div v-if="users.length === 0" class="alert alert-info">
            Zero Users
        </div>
        
        <div v-else>
            <ul>
            <li v-for="user in users" :key="user.id">
                <strong>{{ user.name }}</strong> - {{ user.email }}
            </li>
            </ul>
        </div>
        </div>

 
    `,
    data(){
        return {
            users : []
        }
    },
    computed : {

    },

    async mounted() {
         const res = await fetch(location.origin + '/api/user', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        });
        if (res.ok){
            this.users = await res.json()
            console.log(this.user)
        }else {
            console.warn('error fetching')
        }


    },



}