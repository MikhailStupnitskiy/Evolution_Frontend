
export interface Cards {

    id : number
    multiplier : string
    title_en : string
    title_ru: string
    image_url ?: string
    description: string
    long_description : string
    status: boolean

}

export interface ApiResponse {
    Cards: Cards[];
}
