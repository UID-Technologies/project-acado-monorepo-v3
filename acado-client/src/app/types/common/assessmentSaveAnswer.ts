export interface SaveAnswerRequest {
    contentId?: string;
    questionId?: string;
    optionId?: number[] | null;
    markReview?: number;
    durationSec?: string;
    userFile?: string;
    answerStatement?: string;
    skip?: number;
  
}

export interface SaveAnswerData {
    request: SaveAnswerRequest;
}

export interface SaveAnswerResponse {
    status: number;
    data: SaveAnswerData;
    error: any[];
}
