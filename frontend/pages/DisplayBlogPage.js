export default {
    props : ['id'],
    template : `
    <div class ="p-4">
        <h1> {{blog.title}}  </h1>
        <p> published : {{formattedDate}} </p>
        <div style = "padding-left : 20px;" >
        <img width="150" :src="blog.image_url" :alt="blog.title" />
        <div>
        <p v-html="blog.caption"> </p>
        

    </div>
    
    `,
    data(){
        return {
            blog : {},
        }

    },
    computed : {
        formattedDate(){
        return new Date(this.blog.timestamp).toLocaleString();
        }
    
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/blogs/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.blog = await res.json()
        }

    }
}