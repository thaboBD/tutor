from typing import Optional
from fastapi import Form

from pydantic import BaseModel, HttpUrl
from typing import Optional, List


class WhatsAppMedia(BaseModel):
    MediaContentType: Optional[str]
    MediaUrl: Optional[HttpUrl]


class WhatsAppMessage(BaseModel):
    SmsMessageSid: str
    NumMedia: int
    ProfileName: Optional[str]
    SmsSid: str
    WaId: str
    SmsStatus: str
    Body: Optional[str]
    To: str
    NumSegments: int
    ReferralNumMedia: Optional[int]
    MessageSid: str
    AccountSid: str
    From: str
    ApiVersion: str
    Media: List[WhatsAppMedia] = []

    @classmethod
    def from_form(cls, **data):
        media_items = []
        for i in range(data.get("NumMedia", 0)):
            media_items.append(WhatsAppMedia(
                MediaContentType=data.get(f"MediaContentType{i}"),
                MediaUrl=data.get(f"MediaUrl{i}")
            ))
        data["Media"] = media_items
        return cls(**data)


async def whatsapp_message_form(
    SmsMessageSid: str = Form(...),
    NumMedia: int = Form(...),
    ProfileName: str = Form(None),
    SmsSid: str = Form(...),
    WaId: str = Form(...),
    SmsStatus: str = Form(...),
    Body: str = Form(None),
    To: str = Form(...),
    NumSegments: int = Form(...),
    ReferralNumMedia: int = Form(0),
    MessageSid: str = Form(...),
    AccountSid: str = Form(...),
    From: str = Form(...),
    ApiVersion: str = Form(...),
    MediaContentType0: str = Form(None),
    MediaUrl0: HttpUrl = Form(None)
) -> WhatsAppMessage:
    return WhatsAppMessage.from_form(
        SmsMessageSid=SmsMessageSid,
        NumMedia=NumMedia,
        ProfileName=ProfileName,
        SmsSid=SmsSid,
        WaId=WaId,
        SmsStatus=SmsStatus,
        Body=Body,
        To=To,
        NumSegments=NumSegments,
        ReferralNumMedia=ReferralNumMedia,
        MessageSid=MessageSid,
        AccountSid=AccountSid,
        From=From,
        ApiVersion=ApiVersion,
        MediaContentType0=MediaContentType0,
        MediaUrl0=MediaUrl0
    )


class QueryModel(BaseModel):
    query: str
