"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartProps = {
  chartData: { name: string; value: number }[];
};

export function Chart({ chartData }: ChartProps) {
  // Mapear os dados do gráfico para o formato do Recharts
  const rechartsData = chartData.map((item) => ({
    ...item,
    fill: item.name === "Deferidos" 
      ? "hsl(var(--chart-2))" 
      : "hsl(var(--chart-1))"
  }));

  const chartConfig = {
    deferidos: {
      label: "Deferidos",
      color: "hsl(var(--chart-2))",
    },
    indeferidos: {
      label: "Indeferidos",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const totalProcessos = React.useMemo(() => {
    return rechartsData.reduce((acc, curr) => acc + curr.value, 0);
  }, [rechartsData]);

  return (
    <Card className="flex flex-col border-none">
      <CardHeader className="items-center pb-0 border-none">
        <CardTitle>Análise de Processos</CardTitle>
        <CardDescription>Dados de Maio a Outubro</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 border-none">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={rechartsData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalProcessos.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Processos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Crescimento de 5.2% neste mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Exibindo dados de processos dos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}