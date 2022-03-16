import System.Environment ( getArgs )
import Control.Arrow

type Pos = (Int, Int)

both f (x,y) = (f x, f y)

move :: Pos -> [Pos] -> [[Pos]]
move dims@(x,y) path = if last path == dims
                         then return path
                         else lol >>= move dims
    where onBoard (x',y') = elem x' [1..x] && elem y' [1..y]
          (x',y') = last path
          lol = (path ++) . return <$> filter onBoard [(x'+1,y'), (x',y'+1)]

main :: IO ()
main = do
    dims <- read . head <$> getArgs
    print $ length $ move dims (return (1,1))
