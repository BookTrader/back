module.exports = {
    render(image){
        const parsedImg = {
            id: image.id,
            url: `http://192.168.100.83:3333/uploads/${image.path}`
        }

        return parsedImg
    },

    renderMany(images){
        return images.map(image => this.render(image));
    },

    renderUserImage(image) {
        let usr_image = {path: image};

        return this.render(usr_image)
    }
}