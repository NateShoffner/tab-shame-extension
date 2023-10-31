import asyncio
import nativemessaging
import os
from pypresence import AioPresence
from dotenv import load_dotenv


def log_event(event):
    with open("log.txt", "a") as f:
        f.write(event + "\n")


async def main():
    rpc = AioPresence(client_id=os.getenv("CLIENT_ID"), loop=asyncio.get_event_loop())

    print("Connecting to Discord RPC")
    await rpc.connect()
    print("Connected to Discord RPC")

    while True:
        message = nativemessaging.get_message()

        log_event("Received message: " + str(message))

        try:
            browser = message["browser"]
            version = message["version"]
            tabs = message["tabs"]
            windows = message["windows"]

            await rpc.update(
                state=f"Windows: {windows} | Tabs: {tabs}",
                large_image=browser.lower(),
                details=f"{browser} {version}",
            )
        except Exception as e:
            log_event(str(e))


if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())
