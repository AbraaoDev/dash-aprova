import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Aprova</p>
          <p className="text-sm text-muted-foreground">
            Licença para Construção
          </p>
        </div>
        <div className="ml-auto font-medium">563</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Aprova</p>
          <p className="text-sm text-muted-foreground">
            Certidão de Uso e Ocupação do Solo
          </p>
        </div>
        <div className="ml-auto font-medium">255</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Aprova</p>
          <p className="text-sm text-muted-foreground">Alvará de Demolição</p>
        </div>
        <div className="ml-auto font-medium">204</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Aprova</p>
          <p className="text-sm text-muted-foreground">Pré-Análise</p>
        </div>
        <div className="ml-auto font-medium">97</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Aprova</p>
          <p className="text-sm text-muted-foreground">
            Substituição de Plantas
          </p>
        </div>
        <div className="ml-auto font-medium">97</div>
      </div>
    </div>
  );
}
