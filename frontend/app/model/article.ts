class Article {
    constructor(
        public uid: string,
        public title: string,
        public body: string,
        public thumbnail: string,
        public createdAt: string,
        public updatedAt: string,
    ) {
        this.uid = uid;
        this.title = title;
        this.body = body;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Article;