export interface StatusProps {
    valor: string
    cor: string
    descricao: string
    largura: string
}

export default function Status(props: StatusProps) {
  const { valor, cor, descricao, largura } = props
  return (
    <div
      className={`flex items-center justify-center 
        rounded-lg p-1 text-white
        ${cor}
      `}
      style={{ width: `${largura}px` }}
    >
      {descricao ?? valor}
    </div>
  )
}