/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsCards {
  description?: string;
  id?: number;
  image_url?: string;
  long_description?: string;
  multiplier?: string;
  status?: boolean;
  title_en?: string;
  title_ru?: string;
}

export interface DsMoves {
  creator: DsUsers;
  creator_id: number;
  cube: number;
  date_create: string;
  date_finish: string;
  date_update: string;
  id: number;
  moderator: DsUsers;
  moderator_id: number;
  player: string;
  stage: string;
  status: number;
}

export interface DsUsers {
  id: number;
  is_moderator: boolean;
  login: string;
  password: string;
}

export interface SchemasAddCardToMoveResponse {
  cardID?: number;
  messageResponse?: string;
  moveID?: number;
}

export interface SchemasChangePassword {
  new_password?: string;
  old_password?: string;
}

export interface SchemasCreateCardRequest {
  description?: string;
  id?: number;
  image_url?: string;
  long_description?: string;
  multiplier?: string;
  status?: boolean;
  title_en?: string;
  title_ru?: string;
}

export interface SchemasCreateCardResponse {
  id?: number;
  messageResponse?: string;
}

export interface SchemasDeleteCardFromMoveRequest {
  card_id?: number;
  id?: string;
}

export interface SchemasDeleteCardResponse {
  id?: number;
  messageResponse?: string;
}

export interface SchemasGetAllCardsResponse {
  cards?: DsCards[];
  count?: number;
  move_ID?: number;
}

export interface SchemasGetAllMovesWithParamsResponse {
  Moves?: DsMoves[];
}

export interface SchemasGetCardResponse {
  card?: DsCards;
}

export interface SchemasGetMoveResponse {
  move_cards?: SchemasInfoForMove[];
  moves?: Record<string, any>;
}

export interface SchemasInfoForMove {
  card: DsCards;
  food: number;
}

export interface SchemasLoginUserRequest {
  login?: string;
  password?: string;
}

export interface SchemasLogoutUserRequest {
  login?: string;
}

export interface SchemasRegisterUserRequest {
  login?: string;
  password?: string;
}

export type SchemasResponseMessage = object;

export interface SchemasUpdateCardRequest {
  description?: string;
  id?: number;
  image_url?: string;
  long_description?: string;
  multiplier?: string;
  status?: boolean;
  title_en?: string;
  title_ru?: string;
}

export interface SchemasUpdateCardResponse {
  id?: number;
  messageResponse?: string;
}

export interface SchemasUpdateFoodMoveCardRequest {
  card_id?: number;
  food?: number;
  id?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title No title
 * @contact
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Создать карту со свойствами
     *
     * @tags cards
     * @name CardCreate
     * @summary Создать карту
     * @request POST:/api/card
     * @secure
     */
    cardCreate: (body: SchemasCreateCardRequest, params: RequestParams = {}) =>
      this.request<SchemasCreateCardResponse, SchemasResponseMessage>({
        path: `/api/card`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет карту по ее ID
     *
     * @tags cards
     * @name CardDelete
     * @summary Удалить карту по ID
     * @request DELETE:/api/card/{ID}
     * @secure
     */
    cardDelete: (id: string, params: RequestParams = {}) =>
      this.request<SchemasDeleteCardResponse, SchemasResponseMessage>({
        path: `/api/card/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить информацию о карте по ее названию
     *
     * @tags cards
     * @name CardDetail
     * @summary Получить карту по названию
     * @request GET:/api/card/{ID}
     * @secure
     */
    cardDetail: (id: string, params: RequestParams = {}) =>
      this.request<SchemasGetCardResponse, SchemasResponseMessage>({
        path: `/api/card/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить карту по ее ID с параметрами
     *
     * @tags cards
     * @name CardUpdate
     * @summary Обновить карту по ID
     * @request PUT:/api/card/{ID}
     * @secure
     */
    cardUpdate: (id: string, body: SchemasUpdateCardRequest, params: RequestParams = {}) =>
      this.request<SchemasUpdateCardResponse, SchemasResponseMessage>({
        path: `/api/card/${id}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Поменять картинку используя ее ID
     *
     * @tags cards
     * @name CardChangePicCreate
     * @summary Поменять картинку по ID
     * @request POST:/api/card/change_pic/{ID}
     * @secure
     */
    cardChangePicCreate: (
      id: string,
      data: {
        /** File */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SchemasResponseMessage, any>({
        path: `/api/card/change_pic/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Этот эндпойнт позволяет добавить карту в ход по ее ID
     *
     * @tags cards
     * @name CardToMoveCreate
     * @summary Добавить карту в ход
     * @request POST:/api/card_to_move/{ID}
     * @secure
     */
    cardToMoveCreate: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<SchemasAddCardToMoveResponse, SchemasResponseMessage>({
        path: `/api/card_to_move/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список всех карт.
     *
     * @tags cards
     * @name CardsList
     * @summary Получить все карты
     * @request GET:/api/cards
     * @secure
     */
    cardsList: (params: RequestParams = {}) =>
      this.request<SchemasGetAllCardsResponse, SchemasResponseMessage>({
        path: `/api/cards`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Change the password of the authenticated user
     *
     * @tags users
     * @name ChangeUserInfoUpdate
     * @summary Change user password
     * @request PUT:/api/change_user_info
     * @secure
     */
    changeUserInfoUpdate: (body: SchemasChangePassword, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/change_user_info`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticates a user and returns a JWT token.
     *
     * @tags users
     * @name LoginUserCreate
     * @summary Login a user
     * @request POST:/api/login_user
     */
    loginUserCreate: (body: SchemasLoginUserRequest, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/login_user`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Log out the user by blacklisting the token
     *
     * @tags users
     * @name LogoutCreate
     * @summary Logout
     * @request POST:/api/logout
     */
    logoutCreate: (body: SchemasLogoutUserRequest, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/logout`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список ходов с возможностью фильтрации по статусу и датам
     *
     * @tags moves
     * @name MoveList
     * @summary Получить все заявки на ходы с параметрами
     * @request GET:/api/move
     * @secure
     */
    moveList: (
      query?: {
        /** Статус хода */
        status?: number;
        /** Наличие статуса */
      },
      params: RequestParams = {},
    ) =>
      this.request<SchemasGetAllMovesWithParamsResponse, SchemasResponseMessage>({
        path: `/api/move`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить заявку на ход по ID
     *
     * @tags moves
     * @name MoveDelete
     * @summary Удалить ход
     * @request DELETE:/api/move/{ID}
     * @secure
     */
    moveDelete: (id: number, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/move/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить детализированную информацию о ходе, включая карты, участвующие в ходе, и их статус
     *
     * @tags moves
     * @name MoveDetail
     * @summary Получить заявку на ход по ID
     * @request GET:/api/move/{ID}
     * @secure
     */
    moveDetail: (id: number, params: RequestParams = {}) =>
      this.request<SchemasGetMoveResponse, SchemasResponseMessage>({
        path: `/api/move/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить информацию о ходе, включая поля игрока и этапа
     *
     * @tags moves
     * @name MoveUpdate
     * @summary Обновить поля хода
     * @request PUT:/api/move/{ID}
     * @secure
     */
    moveUpdate: (id: string, stage: string, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/move/${id}`,
        method: "PUT",
        body: stage,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Завершить ход по его ID, обновив его статус
     *
     * @tags moves
     * @name MoveFinishUpdate
     * @summary Завершить ход
     * @request PUT:/api/move/finish/{ID}
     * @secure
     */
    moveFinishUpdate: (id: string, status: number, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/move/finish/${id}`,
        method: "PUT",
        body: status,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Сформировать ход по его ID
     *
     * @tags moves
     * @name MoveFormUpdate
     * @summary Сформировать ход
     * @request PUT:/api/move/form/{ID}
     * @secure
     */
    moveFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/move/form/${id}`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет карту из запроса на ход по ID запроса и CardID
     *
     * @tags moves_cards
     * @name MoveCardsDelete
     * @summary Удалить карту из запроса на ход
     * @request DELETE:/api/move_cards/{ID}
     * @secure
     */
    moveCardsDelete: (id: string, body: SchemasDeleteCardFromMoveRequest, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/move_cards/${id}`,
        method: "DELETE",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет количество корма для карты в заявке
     *
     * @tags moves_cards
     * @name MoveCardsUpdate
     * @summary Обновить количество корма для карты в ходе
     * @request PUT:/api/move_cards/{ID}
     * @secure
     */
    moveCardsUpdate: (id: string, body: SchemasUpdateFoodMoveCardRequest, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/move_cards/${id}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new user.
     *
     * @tags users
     * @name RegisterUserCreate
     * @summary Register a new user
     * @request POST:/api/register_user
     */
    registerUserCreate: (body: SchemasRegisterUserRequest, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/register_user`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
