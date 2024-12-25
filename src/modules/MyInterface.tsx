import { SchemasInfoForMove } from "../api/Api"

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

export interface ApiResponseGetAllCards{
    Cards: Cards[];
    MoveID: number;
    CardsInMoveCount: number;
}

export interface User {
    id: number;
    login: string;
    password: string;
    is_moderator: boolean;
}

export interface Move { 
    id: number;
    status: number;   
	date_create:  string;
	date_update: string;
	date_finish: string;
	creator_id: number;    	
	Creator: User;    
	Moderator: User;   
	player: string;   
	stage: string;   
	cube: number;      
}

export interface MoveResponse {
    move_cards?: SchemasInfoForMove[];
    moves?: Record<string, any>;
}