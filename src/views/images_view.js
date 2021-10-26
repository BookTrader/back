module.exports = {
    render(image){
        return {
            id: image.id,
            url: `http://192.168.100.77:3333/uploads/${image.path}`
        }
    },

    renderMany(images){
        return images.map(image => this.render(image));
    },

    renderUserImage(image) {
        let usr_image = {path: image};

        return this.render(usr_image)
    }
}