/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 5.28.2
 * source: am2mxm-api.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
import * as grpc_web_1 from "grpc-web";
export enum SearchType {
    LINK = 0,
    SOURCE = 1,
    ABSTRACK = 2
}
export class SearchQuery extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        type?: SearchType;
        query?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("type" in data && data.type != undefined) {
                this.type = data.type;
            }
            if ("query" in data && data.query != undefined) {
                this.query = data.query;
            }
        }
    }
    get type() {
        return pb_1.Message.getFieldWithDefault(this, 1, SearchType.LINK) as SearchType;
    }
    set type(value: SearchType) {
        pb_1.Message.setField(this, 1, value);
    }
    get query() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set query(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    static fromObject(data: {
        type?: SearchType;
        query?: string;
    }): SearchQuery {
        const message = new SearchQuery({});
        if (data.type != null) {
            message.type = data.type;
        }
        if (data.query != null) {
            message.query = data.query;
        }
        return message;
    }
    toObject() {
        const data: {
            type?: SearchType;
            query?: string;
        } = {};
        if (this.type != null) {
            data.type = this.type;
        }
        if (this.query != null) {
            data.query = this.query;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.type != SearchType.LINK)
            writer.writeEnum(1, this.type);
        if (this.query.length)
            writer.writeString(2, this.query);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SearchQuery {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SearchQuery();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.type = reader.readEnum();
                    break;
                case 2:
                    message.query = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): SearchQuery {
        return SearchQuery.deserialize(bytes);
    }
}
export class SearchResult extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        type?: SearchType;
        tracks?: TrackInfo[];
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("type" in data && data.type != undefined) {
                this.type = data.type;
            }
            if ("tracks" in data && data.tracks != undefined) {
                this.tracks = data.tracks;
            }
        }
    }
    get type() {
        return pb_1.Message.getFieldWithDefault(this, 1, SearchType.LINK) as SearchType;
    }
    set type(value: SearchType) {
        pb_1.Message.setField(this, 1, value);
    }
    get tracks() {
        return pb_1.Message.getRepeatedWrapperField(this, TrackInfo, 2) as TrackInfo[];
    }
    set tracks(value: TrackInfo[]) {
        pb_1.Message.setRepeatedWrapperField(this, 2, value);
    }
    static fromObject(data: {
        type?: SearchType;
        tracks?: ReturnType<typeof TrackInfo.prototype.toObject>[];
    }): SearchResult {
        const message = new SearchResult({});
        if (data.type != null) {
            message.type = data.type;
        }
        if (data.tracks != null) {
            message.tracks = data.tracks.map(item => TrackInfo.fromObject(item));
        }
        return message;
    }
    toObject() {
        const data: {
            type?: SearchType;
            tracks?: ReturnType<typeof TrackInfo.prototype.toObject>[];
        } = {};
        if (this.type != null) {
            data.type = this.type;
        }
        if (this.tracks != null) {
            data.tracks = this.tracks.map((item: TrackInfo) => item.toObject());
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.type != SearchType.LINK)
            writer.writeEnum(1, this.type);
        if (this.tracks.length)
            writer.writeRepeatedMessage(2, this.tracks, (item: TrackInfo) => item.serialize(writer));
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SearchResult {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SearchResult();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.type = reader.readEnum();
                    break;
                case 2:
                    reader.readMessage(message.tracks, () => pb_1.Message.addToRepeatedWrapperField(message, 2, TrackInfo.deserialize(reader), TrackInfo));
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): SearchResult {
        return SearchResult.deserialize(bytes);
    }
}
export class TrackInfo extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        isrc?: string;
        title?: string;
        artist?: string;
        mxm_abstrack?: string;
        mxm_track_url?: string;
        mxm_album?: string;
        mxm_album_url?: string;
        am_track_url?: string;
        am_album_url?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("isrc" in data && data.isrc != undefined) {
                this.isrc = data.isrc;
            }
            if ("title" in data && data.title != undefined) {
                this.title = data.title;
            }
            if ("artist" in data && data.artist != undefined) {
                this.artist = data.artist;
            }
            if ("mxm_abstrack" in data && data.mxm_abstrack != undefined) {
                this.mxm_abstrack = data.mxm_abstrack;
            }
            if ("mxm_track_url" in data && data.mxm_track_url != undefined) {
                this.mxm_track_url = data.mxm_track_url;
            }
            if ("mxm_album" in data && data.mxm_album != undefined) {
                this.mxm_album = data.mxm_album;
            }
            if ("mxm_album_url" in data && data.mxm_album_url != undefined) {
                this.mxm_album_url = data.mxm_album_url;
            }
            if ("am_track_url" in data && data.am_track_url != undefined) {
                this.am_track_url = data.am_track_url;
            }
            if ("am_album_url" in data && data.am_album_url != undefined) {
                this.am_album_url = data.am_album_url;
            }
        }
    }
    get isrc() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set isrc(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get title() {
        return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
    }
    set title(value: string) {
        pb_1.Message.setField(this, 2, value);
    }
    get artist() {
        return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
    }
    set artist(value: string) {
        pb_1.Message.setField(this, 3, value);
    }
    get mxm_abstrack() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set mxm_abstrack(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get mxm_track_url() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set mxm_track_url(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get mxm_album() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set mxm_album(value: string) {
        pb_1.Message.setField(this, 6, value);
    }
    get mxm_album_url() {
        return pb_1.Message.getFieldWithDefault(this, 7, "") as string;
    }
    set mxm_album_url(value: string) {
        pb_1.Message.setField(this, 7, value);
    }
    get am_track_url() {
        return pb_1.Message.getFieldWithDefault(this, 8, "") as string;
    }
    set am_track_url(value: string) {
        pb_1.Message.setField(this, 8, value);
    }
    get am_album_url() {
        return pb_1.Message.getFieldWithDefault(this, 9, "") as string;
    }
    set am_album_url(value: string) {
        pb_1.Message.setField(this, 9, value);
    }
    static fromObject(data: {
        isrc?: string;
        title?: string;
        artist?: string;
        mxm_abstrack?: string;
        mxm_track_url?: string;
        mxm_album?: string;
        mxm_album_url?: string;
        am_track_url?: string;
        am_album_url?: string;
    }): TrackInfo {
        const message = new TrackInfo({});
        if (data.isrc != null) {
            message.isrc = data.isrc;
        }
        if (data.title != null) {
            message.title = data.title;
        }
        if (data.artist != null) {
            message.artist = data.artist;
        }
        if (data.mxm_abstrack != null) {
            message.mxm_abstrack = data.mxm_abstrack;
        }
        if (data.mxm_track_url != null) {
            message.mxm_track_url = data.mxm_track_url;
        }
        if (data.mxm_album != null) {
            message.mxm_album = data.mxm_album;
        }
        if (data.mxm_album_url != null) {
            message.mxm_album_url = data.mxm_album_url;
        }
        if (data.am_track_url != null) {
            message.am_track_url = data.am_track_url;
        }
        if (data.am_album_url != null) {
            message.am_album_url = data.am_album_url;
        }
        return message;
    }
    toObject() {
        const data: {
            isrc?: string;
            title?: string;
            artist?: string;
            mxm_abstrack?: string;
            mxm_track_url?: string;
            mxm_album?: string;
            mxm_album_url?: string;
            am_track_url?: string;
            am_album_url?: string;
        } = {};
        if (this.isrc != null) {
            data.isrc = this.isrc;
        }
        if (this.title != null) {
            data.title = this.title;
        }
        if (this.artist != null) {
            data.artist = this.artist;
        }
        if (this.mxm_abstrack != null) {
            data.mxm_abstrack = this.mxm_abstrack;
        }
        if (this.mxm_track_url != null) {
            data.mxm_track_url = this.mxm_track_url;
        }
        if (this.mxm_album != null) {
            data.mxm_album = this.mxm_album;
        }
        if (this.mxm_album_url != null) {
            data.mxm_album_url = this.mxm_album_url;
        }
        if (this.am_track_url != null) {
            data.am_track_url = this.am_track_url;
        }
        if (this.am_album_url != null) {
            data.am_album_url = this.am_album_url;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.isrc.length)
            writer.writeString(1, this.isrc);
        if (this.title.length)
            writer.writeString(2, this.title);
        if (this.artist.length)
            writer.writeString(3, this.artist);
        if (this.mxm_abstrack.length)
            writer.writeString(4, this.mxm_abstrack);
        if (this.mxm_track_url.length)
            writer.writeString(5, this.mxm_track_url);
        if (this.mxm_album.length)
            writer.writeString(6, this.mxm_album);
        if (this.mxm_album_url.length)
            writer.writeString(7, this.mxm_album_url);
        if (this.am_track_url.length)
            writer.writeString(8, this.am_track_url);
        if (this.am_album_url.length)
            writer.writeString(9, this.am_album_url);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TrackInfo {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new TrackInfo();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.isrc = reader.readString();
                    break;
                case 2:
                    message.title = reader.readString();
                    break;
                case 3:
                    message.artist = reader.readString();
                    break;
                case 4:
                    message.mxm_abstrack = reader.readString();
                    break;
                case 5:
                    message.mxm_track_url = reader.readString();
                    break;
                case 6:
                    message.mxm_album = reader.readString();
                    break;
                case 7:
                    message.mxm_album_url = reader.readString();
                    break;
                case 8:
                    message.am_track_url = reader.readString();
                    break;
                case 9:
                    message.am_album_url = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): TrackInfo {
        return TrackInfo.deserialize(bytes);
    }
}
export abstract class UnimplementedSearchService {
    static definition = {
        SearchByQuery: {
            path: "/lunaiz.am2mxm.api.v1.Search/SearchByQuery",
            requestStream: false,
            responseStream: false,
            requestSerialize: (message: SearchQuery) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => SearchQuery.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: SearchResult) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => SearchResult.deserialize(new Uint8Array(bytes))
        }
    };
    [method: string]: grpc_1.UntypedHandleCall;
    abstract SearchByQuery(call: grpc_1.ServerUnaryCall<SearchQuery, SearchResult>, callback: grpc_1.sendUnaryData<SearchResult>): void;
}
export class SearchClient {
    private _address: string;
    private _client: grpc_web_1.GrpcWebClientBase;
    constructor(address: string, credentials?: Object, options?: grpc_web_1.GrpcWebClientBaseOptions) {
        if (!options)
            options = {};
        options.format = options.format || "text";
        this._address = address;
        this._client = new grpc_web_1.GrpcWebClientBase(options);
    }
    private static SearchByQuery = new grpc_web_1.MethodDescriptor<SearchQuery, SearchResult>("/lunaiz.am2mxm.api.v1.Search/SearchByQuery", grpc_web_1.MethodType.UNARY, SearchQuery, SearchResult, (message: SearchQuery) => message.serialize(), SearchResult.deserialize);
    SearchByQuery(message: SearchQuery, metadata: grpc_web_1.Metadata | null) {
        return this._client.thenableCall<SearchQuery, SearchResult>(this._address + "/lunaiz.am2mxm.api.v1.Search/SearchByQuery", message, metadata || {}, SearchClient.SearchByQuery);
    }
}
