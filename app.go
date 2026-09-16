package main

import (
	"context"
	"errors"

	//metrics
	"RubyAgency/internal/metrics"
)

type App struct {
	ctx context.Context
}


func NewApp() *App {
	return  &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}


func (a *App) GetCpuInfo() (metrics.CpuInfo,error) {
	CheckCpu,err := metrics.CpuCheck()
	if err != nil {
		return metrics.CpuInfo{},errors.New("app.go error: GetCpuInfo error: error get CpuCheck function.")
	}

	return CheckCpu,nil
}

func (a *App) GetRamInfo() (metrics.RamInfo,error) {
	CheckRam,err := metrics.RamCheck()
	if err != nil {
		return metrics.RamInfo{},errors.New("app.go error: GetRamInfo error: error get RamCheck function.")
	}

	return CheckRam,nil
}

func (a *App) GetDiskInfo() ([]metrics.DiskInfo,error) {
	CheckDisk,err := metrics.DiskCheck()
	if err != nil {
		return []metrics.DiskInfo{},errors.New("app.go error: GetDiskInfo error: error get DiskCheck function.")
	}

	return CheckDisk,nil
}

func (a *App) GetNetworkInfo() ([]metrics.NetworkInfo,error) {
	CheckNetwork,err := metrics.NetworkCheck()
	if err != nil {
		return []metrics.NetworkInfo{},errors.New("app.go error: GetNetworkInfo error: error get NetworkCheck function.")
	}

	return CheckNetwork,nil
}
