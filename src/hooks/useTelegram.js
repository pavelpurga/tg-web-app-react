const tg= window.Telegram.WebApp;

export function useTelegram(){
    const onClose =()=>{
        tg.close();
    }
    const onToggleButton =()=>{
        tg.MainButton.show()
    }
    return{
        onClose,
        onToggleButton,
        tg,
        user: tg.initDataUnsafe?.user,
    }
}