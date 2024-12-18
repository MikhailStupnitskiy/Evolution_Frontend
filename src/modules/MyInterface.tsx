
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
    ID: number;
    Status: number;   
	DateCreate:  string;
	DateUpdate: string;
	DateFinish: string;
	CreatorID: number;    	
	Creator: User;    
	Moderator: User;   
	Player: string;   
	Stage: string;   
	Cube: number;      
}

export interface MoveResponse {
    Move: Move;
    Count: number;
    CardsMoves: Cards[];
}