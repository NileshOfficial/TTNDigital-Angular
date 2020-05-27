export interface buzz {
    description: string;
    category: string;
    images: Array<string>;
    likes: number;
    dislikes: number;
    date: number;
    email: string;
};

export interface buzzFormData {
    description: string;
    category: string;
    images: Array<File>;
}