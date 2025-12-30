# Yomiban! A multiplatform UI for websocket based text extraction

Hello !  
I made Yomiban as a Linux compatible application as a replacement for the well designed UI of LunaTranslator.    
Use of this tool does not require the use of LunaTranslator. The point is to provide a multiplatform   
text extraction display window that is compatible with chrome extensions.  


## #TLDR Features
- UI to display text from text extraction programs (using websockets)
  - Transparent "overlay"
  - Clickthrough
  - Hides on inactive state
  - Toggle with a hotkey
  - Add any chrome extension (e.g Yomitan as floating dictionaries)
  - Can use hover dictionaries such as yomitan to display translations
- Linux compatible
- No pointless autotranslations to disable
- This tool features no text extraction component. That is relegated to separate tools. This simply uses the commonly used websocket technique of the tools to fetch and display data. Meaning it must me used in tandem with them.
  
## The "why" 

I used to use LunaTranslator as the UI- and text extraction tool parts were great, even though the automatic translations were completely useless for a Japanese learner such as myself.  
The UI of LunaTranslator supports WebView, which also meant that using chrome plugins in LunaTranslator was a possibility.

That meant that LunaTranslator had a very important UX pro over other text extraction tools:  
The possibility of using the Yomitan floating dictionary "within the application screen" in a way.  
Basically the UI of LunaTranslator is a floating, transparent overlay, that is also clickthrough.  

This meant that the UI could be kept on top of any app that is being extracted, and whenever I need  
a word translated, I could just toggle the clickthrough state with a hotkey, hover the text within the UI and have the  
Yomitan dictionary pop up. 

In terms of UX, this is much, much better than having a separate, non-overlayed browser window.  
This made immersion learning with VNs a way more enjoyable learning experience, since I no longer had to whip  
the mouse around to some external window outside the bounds of the running application.

## Tragedy strikes

Some version of LunaTranslator apparently broke support for Linux, which made the WebView UI invisible   
The developer had made clear that there was no upcoming support for Linux. (at least the ticket was set to a "will not do" state).  
Probably some issue with Webview2? Never really researched that further, since I realized it might be more useful just to make a separate UI for language learners specifically, since most applications use websockets anyways.  


I already had swore off using Windows off-work anymore (the broken patches, hard to modify UI, enshittified system tools, worse poweruser controls, bad performance and AI stockholder cocksucking BS made me lose it, so i made the shift to Linux 100%, not even dualbooting). Essentially becoming a newbie Linux neckbeard wizard.  
This meant it had to roll an UI application of my own. This application is made specifically for language learners who are using PC games such as VNs for immersion learning.  

## ...So intruducing Yomiban!

The UI is even more flexible that the one of LunaTranslator. 
!There is no text extraction component! The text is handled  
through the commonly found websocket portion of text extraction programs.  
This means that this UI can be configured to support any extraction program, as long as they support websockets.

Currently, the only tested-to-be-compatible text extraction program is agent by 0xDC00 on github.
I do really recommend using agent though. The script based approach is great, and simplifies the extraction process alot.
(https://github.com/0xDC00/agent)  
Rolling out more compatibilities may be possible.  
The "backend portion" is meant to roll any source of data to a unified format (currently just a json object like so: { Text : 'Data})

Agent can be used side by side with a steam executable for example when running on linux, by using Steam Tinker Launch.  
This UI can be ran natively on Linux however, since the only requirement for functionality is the websocket port to be up and running.  

## Linux use with Steam games/external games added to steam

Main credits of this part to u/nomonight on Reddit for posting the original. Here is a an abridged version of how to use 
agent with games launched with steam (proton)  
(Here is the full link. https://www.reddit.com/r/LearnJapanese/comments/15wsgaq/linux_guide_how_to_use_text_hooker_agent_with/)

- Download Agent from Github >>> Releases >>> Windows version (link above)
- Then download steamtinkerlaunch. (installation guide in the git readme)
https://github.com/sonic2kk/steamtinkerlaunch
- Set STL as compatibility tool. (in steam game properties ->)
  - Open Steam >> Right click on game >> Properties >> Compatibility >> Check "Force the use of a specific Steam Play compatibility  tool" and select "Steam Tinker Launch".

- Press Play. When STL window appears, click "MAIN MENU". Then click "GAME MENU" at the bottom of the window.  

- Under "Misc options" check: "Use custom command", "Fork custom command" and "Force Proton with custom command". Then click on the field next to "Custom command" and locate "agent.exe".  

- You can also choose preferred proton version under "Proton options"  

- When you're done press "SAVE AND PLAY". Game and Agent should start.  

- (Once the agent is on, Yomiban should make a connection...)

- Agent configuration. Click on "Script...". Since it's your first launch of the Agent, click on "Update scripts". It should download all available scripts from the github.  

- Choose the desired script.

- Now, you need to attach Agent to the game process. Just drag and drop the "aim" icon to the game window and press "Attach".

- Yomiban usage explained below.

## How does this work?

The websocket data is relayed from a backend .NET software to the electron App using direct child process I/O (no ports), and from there it is rendered to a chromium based view.  
The idea for the backend is to separate the concern of acquiring the text data to a separate program. This app might be updated at some point (maybe...) to even handle clipboard data, but so far only the websocket technique is supported.  

The chromium based view can then use chrome plugins to do all kinds of fun chrome stuff. With the most important being use of Yomitan!!!  

No extra bells or whistles, no pointless autotranslate tools to disable, just an UI for text extraction programs to use, completely compatible for Linux!

## How do I run it?
Simply start the application you want using SteamTinkerLaunch, or any other suitable method to start a text extraction session using websockets. After that, this app should be configured.

On Windows and Linux the application uses the appData folder for configuration. On start, the folder   
WIN (%APPDATA%/Roaming/Yomiban)
LINUX (~/.config/Yomiban) 
will be generated. 

On start, default configuration will be used. Which means no chrome extensions by default.  
You need to add these yourself, 
since I dont necessarily want to package the work of Yomitan devs within this app.  
Figure out where your choice of chromium browser saves extensions, then grab the extensions you want and then copy the whole unpackaged extension folder to APPDATA/Yomiban/extensions.  
Then you need to edit APPDATA/Yomiban/configuration/config.json  


## Editing the config and preparing extensions
The idea of the config is to make this as modular as possible, but so far the options are somewhat limited, but this is how to configure: 

- webSocket is an important value. This is where the backend fetches data. If this differs in your choice of text extraction program, change this to the correct port.  
- Debug true|false disables or enabled the electron renderer inspector window.  
- The extensions [] array already contains an example how to add Yomitan to the extensions config.  
  - Add other extensions the using the example as a sample. 
  - Extensions do not function if they are not configured in the file beforehand.  
- openSettings true|false indicates whether or not to open the chrome settings page indicate by the extensions manifest. 
  - Starting off you should have it open, since you need to reconfig Yomitan settings and dictionaries. These do not come from your browser .
  - Once you have configured your extensions, the settings will be persistent for your system.

The style portion is in work in progress, but the point of it to allow customizing the UI a bit.  
- text.location indicates a css value of where to place the text on the app.
  good values: start|center|end.
- offset allows a Y axis offset (positive or negative). For example: -5px raises the text by 5 pixels.  
- menubar.hideOnClickThrough hides the top bar of the window completely when in clickthrough mode.  

- inputBindings.clickthrough decides the global input binding for toggling clickthrough state.  
  - Use the clickthrough state until you need something translated, toggle clickthrough to disabled state, use Yomitan -> Learn ->  back to clickthrough. Very simple.  

  - The possible values are here:
https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts  
Chain modifiers and keys with +  
Default key is just TAB  
It might be OK for specific games to have TAB as the hotkey, but this may block e.g game input for TAB.  

Otherwise the config is a bit incomplete, but functional to my needs.  
A proper UI for settings editing will probably be made at some point...  

If a feature is needed, please request directly or pull request it! 

You are free to use or develop this software as per license, thank you.