package main

import (
	"embed"
	"log"

	//github
	"github.com/wailsapp/wails/v2"
    "github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed fronted/index.html fronted/src
var assets embed.FS

func main() {
    // app create
    app := NewApp()

    err := wails.Run(&options.App{
        Title: "RubyAgency",
        Width: 1024,
        Height: 768,
        AssetServer: &assetserver.Options {
            Assets: assets,
        },
        Frameless: true,
        BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 255},
        OnStartup: app.startup,
        Bind: []interface{}{
            app,
        },
    })

    if err != nil {
        log.Fatalf("main.go error: error: %v",err)
    }
}