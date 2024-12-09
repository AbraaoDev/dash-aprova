"use client"
import * as XLSX from "xlsx";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/app/components/date-range-pick";
import { RecentSales } from "@/app/components/recent-sales";
import { Chart } from "./components/chart";
import { useEffect, useState } from "react";




type ChartData = { name: string; value: number };
type TopProcess = { name: string; count: number };

type DataProps = {
  
    defermentRate: number;
    averageDeferralTime: number;
    inProcess: number;
    approvedProcesses: number;
    chartData: ChartData[];
    top10Processes: TopProcess[];
  
}

type RowData = {
  [key: string]: number | string; 
};

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DataProps>({
    defermentRate: 0,
    averageDeferralTime: 0,
    inProcess: 0,
    approvedProcesses: 0,
    chartData: [],
    top10Processes: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const file = await fetch("/relatorio.xlsx").then((res) =>
          res.arrayBuffer()
        );
        const workbook = XLSX.read(file, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: RowData[] = XLSX.utils.sheet_to_json(sheet);
  
        const defermentRate = calculateDefermentRate(data);
        const averageDeferralTime = calculateAverageDeferralTime(data);
        const inProcess = countInProcess(data);
        const approvedProcesses = countApprovedProcesses(data);
        const chartData = generateChartData(data);
        const top10Processes = findTop10Processes(data);
  
        setDashboardData({
          defermentRate,
          averageDeferralTime,
          inProcess,
          approvedProcesses,
          chartData,
          top10Processes,
        });
       
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    }

    
  
    fetchData();
  }, []);
  
  function calculateDefermentRate(data: RowData[]): number {
    const totalDeferidos = data.reduce((acc, row) => {
      return acc + Object.keys(row)
        .filter((key) => key.includes("Deferidos"))
        .reduce((subAcc, key) => {
          const value = row[key];
          return subAcc + (typeof value === "number" ? value : 0); 
        }, 0);
    }, 0);
  
    const totalIndeferidos = data.reduce((acc, row) => {
      return acc + Object.keys(row)
        .filter((key) => key.includes("Indeferidos"))
        .reduce((subAcc, key) => {
          const value = row[key];
          return subAcc + (typeof value === "number" ? value : 0); 
        }, 0);
    }, 0);
  
    const totalProcessos = totalDeferidos + totalIndeferidos;
    return totalProcessos ? (totalDeferidos / totalProcessos) * 100 : 0;
  }
  

  function calculateAverageDeferralTime(data: RowData[]): number {
    const totalTempoEmHoras = data.reduce((acc, row) => {
      const tempo = row["Tempo médio de deferimento"] || ""; 
      if (typeof tempo === "string") { 
        const matches = tempo.match(/(\d+) dias.*?(\d+) horas/); 
        if (matches) {
          const dias = parseInt(matches[1], 10) || 0; 
          const horas = parseInt(matches[2], 10) || 0; 
          return acc + dias * 24 + horas; 
        }
      }
      return acc;
    }, 0);
  
    return totalTempoEmHoras ? totalTempoEmHoras / (24 * data.length) : 0; 
  }
  
  function countInProcess(data: RowData[]): number {
    console.log("Linhas da tabela:", data);
  
    return data.reduce((acc, row) => {
      const value = row["Processos criados entre maio e outubro e se encontram em Trâmite"];
      console.log("Valor encontrado:", value);
  
      const numericValue = typeof value === "number" ? value : parseInt(value as string, 10) || 0;
  
      return acc + numericValue;
    }, 0);
  }
  
  

  function countApprovedProcesses(data: Array<Record<string, any>>): number {
    return data.reduce((acc: number, row: Record<string, any>) => {
      return (
        acc +
        (row["Processocos criados em Maio que se encontram Deferidos"] || 0) +
        (row["Processocos criados em Junhoque se encontram Deferidos"] || 0) +
        (row["Processocos criados em Julho que se encontram Deferidos"] || 0) +
        (row["Processocos criados em Agostoque se encontram Deferidos"] || 0) +
        (row["Processocos criados em Setembro que se encontram Deferidos"] || 0) +
        (row["Processocos criados em Outubro que se encontram Deferidos"] || 0)
      );
    }, 0);
  }
  

  function generateChartData(data: Array<Record<string, any>>): { name: string; value: number }[] {
    const deferidos = countApprovedProcesses(data);
    const indeferidos = data.reduce((acc: number, row: Record<string, any>) => {
      return (
        acc +
        (row["Processocos criados em Maio que se encontram Indeferidos"] || 0) +
        (row["Processocos criados em Junhoque se encontram Indeferidos"] || 0) +
        (row["Processocos criados em Julho que se encontram Indeferidos"] || 0) +
        (row["Processocos criados em Agostoque se encontram Indeferidos"] || 0) +
        (row["Processocos criados em Setembro que se encontram Indeferidos"] || 0) +
        (row["Processocos criados em Outubro que se encontram Indeferidos"] || 0)
      );
    }, 0);
  
    return [
      { name: "Deferidos", value: deferidos },
      { name: "Indeferidos", value: indeferidos },
    ];
  }
  

  function findTop10Processes(data: RowData[]): { name: string; count: number }[] {
    const processCounts = data.reduce((acc: Record<string, number>, row) => {
      const processName = row["Nome do processo"];
      const processInProcess = row["Processos criados entre maio e outubro e se encontram em Trâmite"];
  
      
      if (processName && typeof processInProcess === "number") {
        
        acc[processName] = (acc[processName] || 0) + processInProcess;
      }
      return acc;
    }, {});
  
    
    return Object.entries(processCounts)
      .map(([name, count]) => ({ name, count })) 
      .sort((a, b) => b.count - a.count) 
      .slice(0, 10); 
  }
  


  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">

        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Análises
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Processos
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notificações
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taxa de Deferimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.defermentRate.toFixed(2)}%</div>
                    <p className="text-xs text-emerald-500">
                      +10 processos em relação ao último mês
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tempo médio de Deferimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.averageDeferralTime.toFixed(2)}</div>
                    <p className="text-xs text-red-500">
                      -66% em relação ao mês passado
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Processos em Trâmite no Aprova
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{dashboardData.inProcess}</div>
                    <p className="text-xs text-emerald-500">
                      +19% em relação ao mês passado
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Quantidade de Processos deferidos entre Maio e Outubro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                    {dashboardData.approvedProcesses}
                    </div>
                    <p className="text-xs text-emerald-500">
                      +50 processos abertos nesse dia
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <Chart chartData={dashboardData.chartData} />
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Top 10 Processos mais solicitados</CardTitle>
                    <CardDescription>
                      Abaixo estão listados os processos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales top10Processes={dashboardData.top10Processes}/>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
