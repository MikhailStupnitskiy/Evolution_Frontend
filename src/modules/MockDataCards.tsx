
import { ApiResponse } from "./MyInterface";


export const MOCK_DATA_CARDS : ApiResponse = {
    Cards : [

        {
            
            id: 1,
            multiplier : "+1",
            title_en: "HIGH BODY WEIGHT",
            title_ru: "БОЛЬШОЙ",
            description: "Данное животное может быть съедено только БОЛЬШИМ хищником",
            long_description:"",
            status: true
        },
    
        {
    
            id: 2,
            multiplier : "",
            title_en: "RUNNING",
            title_ru: "БЫСТРОЕ",
            description: "Когда ваше животное с этим свойством атаковано, бросьте кубик",
            long_description: "",
            status: true
        },
    
        {
    
            id: 3,
            multiplier : "",
            title_en: "POISONOUS",
            title_ru: "ЯДОВИТОЕ",
            description: "Хищник, съевший это животное, в фазу вымирания погибает",
            long_description: "",
            status: true
    
        },
        {
            
            id: 4,
            multiplier : "",
            title_en: "BURROWING",
            title_ru: "НОРНОЕ",
            description: "Когда животное НАКОРМЛЕНО, оно не может быть атаковано хищником",
            long_description: "",
            status: true
        }

    ]
}
