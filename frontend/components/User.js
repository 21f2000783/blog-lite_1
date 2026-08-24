// import { fetchWithAuth } from "../utils/fetchWithAuth.js"

export default {
    props : ['email', 'followers', 'id', 'posts'],
    template : `
    <div class="jumbotron">
        <h2> {{email}} </h2>
        <hr>
        <p> followers {{followers}} </p>
        <p> Posts {{posts}} </p>
        <button class="btn btn-info btn-lg" @click="sendFollow">Follow </button>
        <button class="btn btn-danger btn-lg" @click="sendUnfollow">Un-Follow </button>
    </div>
    `,
    methods : {
        async sendFollow(){
            const res = await fetch('/follow/' + this.id, {
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authentication-Token': this.$store.state.auth_token
                }
            });
            if (res.ok){
                // add popup
                alert('user followed')
                console.log('user followed')
            }
        },
        async sendUnfollow(){
            const res = await fetch('/unfollow/' + this.id, {
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authentication-Token': this.$store.state.auth_token

                }
            });
            if (res.ok){
                // add popup
                alert('user un-followed')
                console.log('user un-followed')
               
            }
        }
    }
}