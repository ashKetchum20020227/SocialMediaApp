
import "./chatonline.css"

function ChatOnline() {
    return (
        <>
            <div className="chatOnline">
                <div className="chatOnlineFriend">
                    <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/07/pokemon-ash-ketchum-1.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5" alt="" />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">Ash Ketchum</span>
                </div>
            </div>
        </>
    )
}

export default ChatOnline