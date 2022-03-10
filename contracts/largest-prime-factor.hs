import System.Environment ( getArgs )

getPrimeFactors :: Int -> [Int]
getPrimeFactors n
    | factors == [] = []
    | otherwise = firstFac : getPrimeFactors (div n firstFac)
    where factors  = filter (\x -> (mod n x) == 0) [2..n]
          firstFac = head factors

main :: IO ()
main = do
    n <- show . maximum . getPrimeFactors . read . head <$> getArgs
    putStrLn n
